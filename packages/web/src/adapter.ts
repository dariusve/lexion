import {
  getStatusBarGroupClassName,
  getStatusBarItemClassName,
  lexionStatusBarAppearance,
  splitStatusBarItems,
  type JSONDocument,
  type LexionEditor,
  type LexionStatusBarAlignment,
  type LexionStatusBarItem
} from "@lexion-rte/core";

import type { LexionWebEditorStyleInjectionOptions } from "./styles.js";
import {
  LexionViewController,
  type LexionAccessibilityOptions,
  type LexionChangeHandler
} from "./view-controller.js";

export interface LexionWebEditorOptions extends LexionAccessibilityOptions {
  readonly element: HTMLElement;
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly injectStyles?: boolean;
  readonly styleInjectionOptions?: LexionWebEditorStyleInjectionOptions;
  readonly onChange?: LexionChangeHandler;
  readonly onReady?: (editor: LexionEditor) => void;
}

export interface LexionWebEditorUpdateOptions extends LexionAccessibilityOptions {
  readonly value?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: LexionChangeHandler;
}

const applyInlineStyles = (
  element: HTMLElement,
  styles: Readonly<Record<string, string>> | undefined
): void => {
  if (!styles) {
    return;
  }

  for (const [property, value] of Object.entries(styles)) {
    element.style.setProperty(
      property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`),
      value
    );
  }
};

const renderStatusBarGroup = (group: HTMLElement, items: readonly LexionStatusBarItem[]): void => {
  group.replaceChildren(
    ...items.map((item) => {
      const element = group.ownerDocument.createElement("div");
      element.className = getStatusBarItemClassName(item);
      element.textContent = item.text;
      applyInlineStyles(element, item.style);
      return element;
    })
  );
};

export class LexionWebEditor {
  private readonly controller: LexionViewController;
  private readonly statusBarElement: HTMLDivElement;
  private readonly statusBarGroups: Readonly<Record<LexionStatusBarAlignment, HTMLDivElement>>;
  private accessibility: LexionAccessibilityOptions;
  private destroyed = false;

  public constructor(options: LexionWebEditorOptions) {
    const hostDocument = options.element.ownerDocument;
    this.statusBarElement = hostDocument.createElement("div");
    this.statusBarElement.className = lexionStatusBarAppearance.className;
    const createGroup = (align: LexionStatusBarAlignment): HTMLDivElement => {
      const group = hostDocument.createElement("div");
      group.className = getStatusBarGroupClassName(align);
      return group;
    };
    this.statusBarGroups = { start: createGroup("start"), end: createGroup("end") };
    this.statusBarElement.append(this.statusBarGroups.start, this.statusBarGroups.end);

    this.accessibility = {
      ...(options.ariaLabel !== undefined ? { ariaLabel: options.ariaLabel } : {}),
      ...(options.ariaLabelledBy !== undefined ? { ariaLabelledBy: options.ariaLabelledBy } : {})
    };
    this.controller = new LexionViewController({
      ...options,
      onStatusBarChange: (items) => {
        const groups = splitStatusBarItems(items);
        renderStatusBarGroup(this.statusBarGroups.start, groups.start);
        renderStatusBarGroup(this.statusBarGroups.end, groups.end);
      }
    });
    options.element.appendChild(this.statusBarElement);

    options.onReady?.(this.controller.editor);
  }

  public get editor(): LexionEditor {
    return this.controller.editor;
  }

  public getJSON(): JSONDocument {
    this.assertNotDestroyed();
    return this.controller.editor.getJSON();
  }

  public focus(): void {
    this.assertNotDestroyed();
    this.controller.focus();
  }

  /** Runs an editor command; `onChange` fires only if the command changed the document. */
  public execute(command: string, ...args: readonly unknown[]): boolean {
    this.assertNotDestroyed();
    return this.controller.execute(command, ...args);
  }

  public setValue(value: JSONDocument): void {
    this.assertNotDestroyed();
    this.controller.setValue(value);
  }

  public setReadOnly(readOnly: boolean): void {
    this.assertNotDestroyed();
    this.controller.setReadOnly(readOnly);
  }

  public update(options: LexionWebEditorUpdateOptions): void {
    this.assertNotDestroyed();
    if (options.onChange !== undefined) {
      this.controller.setOnChange(options.onChange);
    }
    if (options.readOnly !== undefined) {
      this.controller.setReadOnly(options.readOnly);
    }
    if (options.ariaLabel !== undefined || options.ariaLabelledBy !== undefined) {
      // Like the other fields, only what is passed changes.
      this.accessibility = {
        ...this.accessibility,
        ...(options.ariaLabel !== undefined ? { ariaLabel: options.ariaLabel } : {}),
        ...(options.ariaLabelledBy !== undefined ? { ariaLabelledBy: options.ariaLabelledBy } : {})
      };
      this.controller.setAccessibility(this.accessibility);
    }
    if (options.value !== undefined) {
      this.controller.setValue(options.value);
    }
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.controller.destroy();
    this.statusBarElement.remove();
    this.destroyed = true;
  }

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error("LexionWebEditor has been destroyed");
    }
  }
}

export const createLexionWebEditor = (options: LexionWebEditorOptions): LexionWebEditor =>
  new LexionWebEditor(options);
