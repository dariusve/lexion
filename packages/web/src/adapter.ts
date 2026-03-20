import {
  LexionEditor,
  lexionStatusBarAppearance,
  type JSONDocument,
  type LexionStatusBarAlignment,
  type LexionStatusBarItem
} from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { EditorView } from "prosemirror-view";

export interface LexionWebEditorOptions {
  readonly element: HTMLElement;
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly injectStyles?: boolean;
  readonly styleInjectionOptions?: LexionWebEditorStyleInjectionOptions;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  readonly onReady?: (editor: LexionEditor) => void;
}

export interface LexionWebEditorUpdateOptions {
  readonly value?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
}

export interface LexionWebEditorStyleInjectionOptions {
  readonly document?: Document;
  readonly id?: string;
  readonly target?: HTMLElement;
}

export const lexionWebEditorStyles = `
.ProseMirror {
  position: relative;
  white-space: pre-wrap;
  word-wrap: break-word;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
}

.ProseMirror:focus {
  outline: none;
}

.ProseMirror pre {
  white-space: pre-wrap;
}
`;

const serializeJSON = (document: JSONDocument): string => JSON.stringify(document);
const PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE =
  "white-space: pre-wrap !important; word-wrap: break-word !important; -webkit-font-variant-ligatures: none; font-variant-ligatures: none;";

const getDefaultDocument = (): Document => {
  if (typeof document !== "undefined") {
    return document;
  }

  throw new Error(
    "A DOM Document is required. Pass { document } when running outside the browser."
  );
};

const toCSSPropertyName = (property: string): string =>
  property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const applyInlineStyles = (
  element: HTMLElement,
  styles: Readonly<Record<string, string>> | undefined
): void => {
  if (!styles) {
    return;
  }

  for (const [property, value] of Object.entries(styles)) {
    element.style.setProperty(toCSSPropertyName(property), value);
  }
};

const createStatusBarGroupElement = (
  host: HTMLElement,
  align: LexionStatusBarAlignment
): HTMLDivElement => {
  const group = host.ownerDocument.createElement("div");
  group.className = `${lexionStatusBarAppearance.groupClassName} ${lexionStatusBarAppearance.groupClassName}--${align}`;
  applyInlineStyles(group, lexionStatusBarAppearance.groupStyles[align]);
  return group;
};

const clearElement = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

export const injectLexionWebEditorStyles = (
  options: LexionWebEditorStyleInjectionOptions = {}
): HTMLStyleElement => {
  const documentNode = options.document ?? getDefaultDocument();
  const styleId = options.id ?? "lexion-web-editor-styles";
  const existing = documentNode.getElementById(styleId);
  if (existing && existing.tagName.toLowerCase() === "style") {
    return existing as HTMLStyleElement;
  }

  const style = documentNode.createElement("style");
  style.id = styleId;
  style.textContent = lexionWebEditorStyles;
  const target = options.target ?? documentNode.head ?? documentNode.documentElement;
  target.appendChild(style);
  return style;
};

const renderStatusBarItems = (
  host: HTMLElement,
  groups: Readonly<Record<LexionStatusBarAlignment, HTMLDivElement>>,
  items: readonly LexionStatusBarItem[]
): void => {
  clearElement(groups.start);
  clearElement(groups.end);

  for (const item of items) {
    const element = host.ownerDocument.createElement("div");
    element.className = item.className
      ? `${lexionStatusBarAppearance.itemClassName} ${item.className}`
      : lexionStatusBarAppearance.itemClassName;
    element.textContent = item.text;
    applyInlineStyles(element, item.style);
    groups[item.align ?? "start"].appendChild(element);
  }
};

export class LexionWebEditor {
  private readonly hostElement: HTMLElement;
  private readonly ownsEditor: boolean;
  private readonly editorInstance: LexionEditor;
  private readonly view: EditorView;
  private readonly statusBarElement: HTMLDivElement;
  private readonly statusBarGroups: Readonly<Record<LexionStatusBarAlignment, HTMLDivElement>>;
  private onChange: ((value: JSONDocument, editor: LexionEditor) => void) | undefined;
  private isReadOnly: boolean;
  private lastAppliedValue: string | null;
  private destroyed: boolean;

  public constructor(options: LexionWebEditorOptions) {
    this.hostElement = options.element;
    if (options.injectStyles !== false) {
      injectLexionWebEditorStyles({
        document: this.hostElement.ownerDocument,
        ...(options.styleInjectionOptions ?? {})
      });
    }
    this.ownsEditor = options.editor === undefined;
    if (options.editor) {
      this.editorInstance = options.editor;
    } else {
      const editorOptions =
        options.defaultValue === undefined
          ? {
              extensions: [starterKitExtension]
            }
          : {
              doc: options.defaultValue,
              extensions: [starterKitExtension]
            };
      this.editorInstance = new LexionEditor(editorOptions);
    }
    this.onChange = options.onChange;
    this.isReadOnly = options.readOnly ?? false;
    this.lastAppliedValue = options.value ? serializeJSON(options.value) : null;
    this.destroyed = false;

    if (options.value !== undefined) {
      if (this.lastAppliedValue !== serializeJSON(this.editorInstance.getJSON())) {
        this.editorInstance.setJSON(options.value);
      }
    }

    this.view = new EditorView(this.hostElement, {
      state: this.editorInstance.state,
      attributes: {
        style: PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE
      },
      editable: () => !this.isReadOnly,
      dispatchTransaction: (transaction) => {
        this.editorInstance.dispatchTransaction(transaction);
        this.view.updateState(this.editorInstance.state);
        this.renderStatusBar();

        const nextValue = this.editorInstance.getJSON();
        this.lastAppliedValue = serializeJSON(nextValue);
        this.onChange?.(nextValue, this.editorInstance);
      }
    });
    this.statusBarElement = this.hostElement.ownerDocument.createElement("div");
    this.statusBarElement.className = lexionStatusBarAppearance.className;
    applyInlineStyles(this.statusBarElement, lexionStatusBarAppearance.style);
    this.statusBarGroups = {
      start: createStatusBarGroupElement(this.hostElement, "start"),
      end: createStatusBarGroupElement(this.hostElement, "end")
    };
    this.statusBarElement.append(this.statusBarGroups.start, this.statusBarGroups.end);
    this.hostElement.appendChild(this.statusBarElement);
    this.renderStatusBar();

    options.onReady?.(this.editorInstance);
  }

  public get editor(): LexionEditor {
    return this.editorInstance;
  }

  public getJSON(): JSONDocument {
    this.assertNotDestroyed();
    return this.editorInstance.getJSON();
  }

  public focus(): void {
    this.assertNotDestroyed();
    this.view.focus();
  }

  public execute(command: string, ...args: readonly unknown[]): boolean {
    this.assertNotDestroyed();
    const executed = this.editorInstance.execute(command, ...args);
    this.view.updateState(this.editorInstance.state);
    this.renderStatusBar();

    const nextValue = this.editorInstance.getJSON();
    this.lastAppliedValue = serializeJSON(nextValue);
    this.onChange?.(nextValue, this.editorInstance);

    return executed;
  }

  public setValue(value: JSONDocument): void {
    this.assertNotDestroyed();
    const serialized = serializeJSON(value);
    if (serialized === this.lastAppliedValue || serialized === serializeJSON(this.editorInstance.getJSON())) {
      this.lastAppliedValue = serialized;
      this.view.updateState(this.editorInstance.state);
      this.renderStatusBar();
      return;
    }

    this.editorInstance.setJSON(value);
    this.lastAppliedValue = serialized;
    this.view.updateState(this.editorInstance.state);
    this.renderStatusBar();
  }

  public setReadOnly(readOnly: boolean): void {
    this.assertNotDestroyed();
    this.isReadOnly = readOnly;
    this.view.setProps({
      editable: () => !this.isReadOnly
    });
  }

  public update(options: LexionWebEditorUpdateOptions): void {
    this.assertNotDestroyed();
    if (options.onChange !== undefined) {
      this.onChange = options.onChange;
    }
    if (options.readOnly !== undefined) {
      this.setReadOnly(options.readOnly);
    }
    if (options.value !== undefined) {
      this.setValue(options.value);
    }
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.view.destroy();
    if (this.statusBarElement.parentNode) {
      this.statusBarElement.parentNode.removeChild(this.statusBarElement);
    }
    if (this.ownsEditor) {
      this.editorInstance.destroy();
    }
    this.destroyed = true;
  }

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error("LexionWebEditor has been destroyed");
    }
  }

  private renderStatusBar(): void {
    renderStatusBarItems(
      this.hostElement,
      this.statusBarGroups,
      this.editorInstance.getStatusBarItems()
    );
  }
}

export const createLexionWebEditor = (options: LexionWebEditorOptions): LexionWebEditor =>
  new LexionWebEditor(options);
