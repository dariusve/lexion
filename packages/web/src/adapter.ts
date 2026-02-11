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

export class LexionWebEditor {
  private readonly ownsEditor: boolean;
  private readonly editorInstance: LexionEditor;
  private readonly view: EditorView;
  private onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  private isReadOnly: boolean;
  private lastAppliedValue: string | null;
  private destroyed: boolean;

  public constructor(options: LexionWebEditorOptions) {
    this.ownsEditor = options.editor === undefined;
    this.editorInstance =
      options.editor ??
      new LexionEditor({
        doc: options.defaultValue,
        extensions: [starterKitExtension]
      });
    this.onChange = options.onChange;
    this.isReadOnly = options.readOnly ?? false;
    this.lastAppliedValue = options.value ? serializeJSON(options.value) : null;
    this.destroyed = false;

    if (options.value !== undefined) {
      this.editorInstance.setJSON(options.value);
    }

    this.view = new EditorView(options.element, {
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

    options.onReady?.(this.editorInstance);
  }

  public get editor(): LexionEditor {
    return this.editorInstance;
  }

  public getJSON(): JSONDocument {
    this.assertNotDestroyed();
    return this.editorInstance.getJSON();
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
