import type { JSONDocument, LexionEditor } from "@lexion/core";
import {
  createLexionWebEditor,
  type LexionWebEditor,
  type LexionWebEditorOptions,
  type LexionWebEditorUpdateOptions
} from "@lexion/web";

export interface LexionSolidAdapterOptions {
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  readonly onReady?: (editor: LexionEditor) => void;
}

export interface LexionSolidAdapterUpdateOptions {
  readonly value?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
}

const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

export class LexionSolidAdapter {
  private readonly initialOptions: LexionSolidAdapterOptions;
  private webEditor: LexionWebEditor | null = null;
  private host: HTMLElement | null = null;
  private currentValue: JSONDocument | undefined;
  private currentReadOnly: boolean;
  private currentOnChange: ((value: JSONDocument, editor: LexionEditor) => void) | undefined;

  public constructor(options: LexionSolidAdapterOptions = {}) {
    this.initialOptions = options;
    this.currentValue = options.value;
    this.currentReadOnly = options.readOnly ?? false;
    this.currentOnChange = options.onChange;
  }

  public mount(element: HTMLElement): void {
    if (this.host === element && this.webEditor) {
      return;
    }

    this.destroy();
    this.host = element;
    this.webEditor = createLexionWebEditor(this.buildWebEditorOptions(element));
  }

  public update(options: LexionSolidAdapterUpdateOptions): void {
    if (options.onChange !== undefined) {
      this.currentOnChange = options.onChange;
    }

    if (options.readOnly !== undefined) {
      this.currentReadOnly = options.readOnly;
    }

    if (options.value !== undefined) {
      this.currentValue = options.value;
    }

    if (!this.webEditor) {
      return;
    }

    const updateOptions: { value?: JSONDocument; readOnly?: boolean } = {
      ...(hasOwn(options, "value") && options.value !== undefined
        ? { value: options.value }
        : {}),
      ...(hasOwn(options, "readOnly") && options.readOnly !== undefined
        ? { readOnly: options.readOnly }
        : {})
    };
    if (Object.keys(updateOptions).length > 0) {
      this.webEditor.update(updateOptions as LexionWebEditorUpdateOptions);
    }
  }

  public setValue(value: JSONDocument): void {
    this.currentValue = value;
    this.webEditor?.update({ value });
  }

  public setReadOnly(readOnly: boolean): void {
    this.currentReadOnly = readOnly;
    this.webEditor?.update({ readOnly });
  }

  public get editor(): LexionEditor | null {
    return this.webEditor?.editor ?? null;
  }

  public execute(command: string, ...args: readonly unknown[]): boolean {
    if (!this.webEditor) {
      throw new Error("LexionSolidAdapter is not mounted. Call mount(element) before execute().");
    }

    return this.webEditor.execute(command, ...args);
  }

  public destroy(): void {
    this.webEditor?.destroy();
    this.webEditor = null;
    this.host = null;
  }

  private buildWebEditorOptions(element: HTMLElement): LexionWebEditorOptions {
    return {
      element,
      readOnly: this.currentReadOnly,
      onChange: (value, editor) => {
        this.currentValue = value;
        this.currentOnChange?.(value, editor);
      },
      ...(this.initialOptions.editor !== undefined
        ? { editor: this.initialOptions.editor }
        : {}),
      ...(this.currentValue !== undefined ? { value: this.currentValue } : {}),
      ...(this.initialOptions.defaultValue !== undefined
        ? { defaultValue: this.initialOptions.defaultValue }
        : {}),
      ...(this.initialOptions.onReady !== undefined
        ? { onReady: this.initialOptions.onReady }
        : {})
    };
  }
}

export const createLexionSolidAdapter = (
  options: LexionSolidAdapterOptions = {}
): LexionSolidAdapter => new LexionSolidAdapter(options);
