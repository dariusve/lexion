import {
  LexionEditor,
  type JSONDocument,
  type LexionEditorUpdateEvent,
  type LexionStatusBarItem
} from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { EditorView } from "prosemirror-view";

import {
  EDITOR_REQUIRED_STYLE_ATTRIBUTE,
  injectLexionWebEditorStyles,
  type LexionWebEditorStyleInjectionOptions
} from "./styles.js";

export type LexionChangeHandler = (value: JSONDocument, editor: LexionEditor) => void;

export interface LexionAccessibilityOptions {
  /** Accessible name for the editable area (`aria-label`). */
  readonly ariaLabel?: string;
  /** Id(s) of the element(s) labelling the editable area (`aria-labelledby`). */
  readonly ariaLabelledBy?: string;
}

export interface LexionViewControllerOptions extends LexionAccessibilityOptions {
  /** Element the ProseMirror view mounts into. */
  readonly element: HTMLElement;
  /** Shared editor. When omitted, the controller creates and owns one (with the starter kit). */
  readonly editor?: LexionEditor;
  /** Controlled value. */
  readonly value?: JSONDocument;
  /** Initial document for an internally created editor. */
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  /** Inject the default stylesheet into the element's document (default `true`). */
  readonly injectStyles?: boolean;
  readonly styleInjectionOptions?: LexionWebEditorStyleInjectionOptions;
  /** Called only when the document changes; not for values applied via `value`/`setValue()`. */
  readonly onChange?: LexionChangeHandler;
  /** Called with the current status bar items on creation and after every editor update. */
  readonly onStatusBarChange?: (items: readonly LexionStatusBarItem[]) => void;
}

/**
 * Framework-agnostic glue between a `LexionEditor` and a ProseMirror `EditorView`.
 * Every adapter builds on this so they share one implementation of:
 * view creation, editor subscription, controlled-value sync, change emission,
 * read-only state, accessibility attributes and status bar updates.
 */
export class LexionViewController {
  private readonly ownsEditor: boolean;
  private readonly editorInstance: LexionEditor;
  private readonly viewInstance: EditorView;
  private readonly unsubscribe: () => void;
  private onChange: LexionChangeHandler | undefined;
  private readonly onStatusBarChange: ((items: readonly LexionStatusBarItem[]) => void) | undefined;
  private isReadOnly: boolean;
  private accessibility: LexionAccessibilityOptions;
  /** Last JSON value received through `value` / `setValue()` (compared by identity). */
  private lastAppliedValue: JSONDocument | null = null;
  /** Last JSON value passed to `onChange` (compared by identity). */
  private lastEmittedValue: JSONDocument | null = null;
  /** True while applying a controlled value, so it is not echoed through `onChange`. */
  private applyingValue = false;
  private destroyed = false;

  public constructor(options: LexionViewControllerOptions) {
    if (options.injectStyles !== false) {
      injectLexionWebEditorStyles({
        document: options.element.ownerDocument,
        ...(options.styleInjectionOptions ?? {})
      });
    }

    this.ownsEditor = options.editor === undefined;
    if (options.editor) {
      this.editorInstance = options.editor;
    } else {
      const initialDoc = options.value ?? options.defaultValue;
      this.editorInstance = new LexionEditor(
        initialDoc === undefined
          ? { extensions: [starterKitExtension] }
          : { doc: initialDoc, extensions: [starterKitExtension] }
      );
    }

    this.onChange = options.onChange;
    this.onStatusBarChange = options.onStatusBarChange;
    this.isReadOnly = options.readOnly ?? false;
    this.accessibility = {
      ...(options.ariaLabel !== undefined ? { ariaLabel: options.ariaLabel } : {}),
      ...(options.ariaLabelledBy !== undefined ? { ariaLabelledBy: options.ariaLabelledBy } : {})
    };

    if (options.value !== undefined) {
      this.applyValue(options.value);
    }

    this.viewInstance = new EditorView(options.element, {
      state: this.editorInstance.state,
      attributes: () => this.getViewAttributes(),
      editable: () => !this.isReadOnly,
      dispatchTransaction: (transaction) => {
        // The subscription below updates the view and emits changes.
        this.editorInstance.dispatchTransaction(transaction);
      }
    });

    // Also picks up changes made outside this view (e.g. `editor.execute()` from a
    // toolbar, or another view sharing the same editor).
    this.unsubscribe = this.editorInstance.subscribe((event) => {
      this.handleEditorUpdate(event);
    });

    this.onStatusBarChange?.(this.editorInstance.getStatusBarItems());
  }

  public get editor(): LexionEditor {
    return this.editorInstance;
  }

  public get view(): EditorView {
    this.assertNotDestroyed();
    return this.viewInstance;
  }

  public get isDestroyed(): boolean {
    return this.destroyed;
  }

  public getStatusBarItems(): readonly LexionStatusBarItem[] {
    this.assertNotDestroyed();
    return this.editorInstance.getStatusBarItems();
  }

  public focus(): void {
    this.assertNotDestroyed();
    this.viewInstance.focus();
  }

  /** Runs an editor command. The view and `onChange` update through the editor subscription. */
  public execute(command: string, ...args: readonly unknown[]): boolean {
    this.assertNotDestroyed();
    return this.editorInstance.execute(command, ...args);
  }

  /**
   * Applies a controlled value. A value identical to the last one applied or emitted is a
   * no-op; otherwise it is compared structurally and only replaces the document (which also
   * resets history) when it actually differs.
   */
  public setValue(value: JSONDocument): void {
    this.assertNotDestroyed();
    this.applyValue(value);
  }

  public setOnChange(onChange: LexionChangeHandler | undefined): void {
    this.onChange = onChange;
  }

  public setReadOnly(readOnly: boolean): void {
    this.assertNotDestroyed();
    if (this.isReadOnly === readOnly) {
      return;
    }
    this.isReadOnly = readOnly;
    this.refreshViewProps();
  }

  public setAccessibility(accessibility: LexionAccessibilityOptions): void {
    this.assertNotDestroyed();
    this.accessibility = accessibility;
    this.refreshViewProps();
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.unsubscribe();
    this.viewInstance.destroy();
    if (this.ownsEditor) {
      this.editorInstance.destroy();
    }
    this.destroyed = true;
  }

  private refreshViewProps(): void {
    // New function identities make ProseMirror re-evaluate attributes and editability.
    this.viewInstance.setProps({
      attributes: () => this.getViewAttributes(),
      editable: () => !this.isReadOnly
    });
  }

  private getViewAttributes(): Record<string, string> {
    const attributes: Record<string, string> = {
      style: EDITOR_REQUIRED_STYLE_ATTRIBUTE,
      role: "textbox",
      "aria-multiline": "true",
      "aria-readonly": this.isReadOnly ? "true" : "false"
    };
    if (this.accessibility.ariaLabel !== undefined) {
      attributes["aria-label"] = this.accessibility.ariaLabel;
    }
    if (this.accessibility.ariaLabelledBy !== undefined) {
      attributes["aria-labelledby"] = this.accessibility.ariaLabelledBy;
    }
    return attributes;
  }

  private applyValue(value: JSONDocument): void {
    if (value === this.lastAppliedValue || value === this.lastEmittedValue) {
      this.lastAppliedValue = value;
      return;
    }

    this.lastAppliedValue = value;
    if (this.editorInstance.schema.nodeFromJSON(value).eq(this.editorInstance.doc)) {
      return;
    }

    this.applyingValue = true;
    try {
      this.editorInstance.setJSON(value);
    } finally {
      this.applyingValue = false;
    }
  }

  private handleEditorUpdate(event: LexionEditorUpdateEvent): void {
    if (this.viewInstance.state !== event.state) {
      this.viewInstance.updateState(event.state);
    }
    this.onStatusBarChange?.(this.editorInstance.getStatusBarItems());

    if (!event.docChanged || this.applyingValue || !this.onChange) {
      return;
    }

    const nextValue = this.editorInstance.getJSON();
    this.lastEmittedValue = nextValue;
    this.onChange(nextValue, this.editorInstance);
  }

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error("LexionViewController has been destroyed");
    }
  }
}
