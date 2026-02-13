import { LexionEditor, type JSONDocument } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";
import { EditorView } from "prosemirror-view";

export interface LexionWebEditorOptions {
  readonly element: HTMLElement;
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  readonly onReady?: (editor: LexionEditor) => void;
}

export interface LexionWebEditorUpdateOptions {
  readonly value?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
}

const serializeJSON = (document: JSONDocument): string => JSON.stringify(document);
const FOOTER_TEXT = "Open Source Limited Version";

const createFooterElement = (host: HTMLElement): HTMLDivElement => {
  const footer = host.ownerDocument.createElement("div");
  footer.className = "lexion-editor-footer";
  footer.textContent = FOOTER_TEXT;
  footer.style.padding = "8px 12px";
  footer.style.borderTop = "1px solid #d7d7d7";
  footer.style.background = "#f7f7f7";
  footer.style.color = "#4a4a4a";
  footer.style.fontSize = "12px";
  footer.style.lineHeight = "1.3";
  footer.style.textAlign = "center";
  footer.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  return footer;
};

export class LexionWebEditor {
  private readonly hostElement: HTMLElement;
  private readonly ownsEditor: boolean;
  private readonly editorInstance: LexionEditor;
  private readonly view: EditorView;
  private readonly footerElement: HTMLDivElement;
  private onChange: ((value: JSONDocument, editor: LexionEditor) => void) | undefined;
  private isReadOnly: boolean;
  private lastAppliedValue: string | null;
  private destroyed: boolean;

  public constructor(options: LexionWebEditorOptions) {
    this.hostElement = options.element;
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
      this.editorInstance.setJSON(options.value);
    }

    this.view = new EditorView(this.hostElement, {
      state: this.editorInstance.state,
      editable: () => !this.isReadOnly,
      dispatchTransaction: (transaction) => {
        this.editorInstance.dispatchTransaction(transaction);
        this.view.updateState(this.editorInstance.state);

        const nextValue = this.editorInstance.getJSON();
        this.lastAppliedValue = serializeJSON(nextValue);
        this.onChange?.(nextValue, this.editorInstance);
      }
    });
    this.footerElement = createFooterElement(this.hostElement);
    this.hostElement.appendChild(this.footerElement);

    options.onReady?.(this.editorInstance);
  }

  public get editor(): LexionEditor {
    return this.editorInstance;
  }

  public getJSON(): JSONDocument {
    this.assertNotDestroyed();
    return this.editorInstance.getJSON();
  }

  public execute(command: string, ...args: readonly unknown[]): boolean {
    this.assertNotDestroyed();
    const executed = this.editorInstance.execute(command, ...args);
    this.view.updateState(this.editorInstance.state);

    const nextValue = this.editorInstance.getJSON();
    this.lastAppliedValue = serializeJSON(nextValue);
    this.onChange?.(nextValue, this.editorInstance);

    return executed;
  }

  public setValue(value: JSONDocument): void {
    this.assertNotDestroyed();
    const serialized = serializeJSON(value);
    if (serialized === this.lastAppliedValue) {
      return;
    }

    this.editorInstance.setJSON(value);
    this.lastAppliedValue = serialized;
    this.view.updateState(this.editorInstance.state);
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
    if (this.footerElement.parentNode) {
      this.footerElement.parentNode.removeChild(this.footerElement);
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
}

export const createLexionWebEditor = (options: LexionWebEditorOptions): LexionWebEditor =>
  new LexionWebEditor(options);
