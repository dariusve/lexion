import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
import {
  createLexionWebEditor,
  type LexionWebEditor,
  type LexionWebEditorOptions,
  type LexionWebEditorUpdateOptions
} from "@lexion-rte/web";

export interface LexionAngularAdapterOptions {
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  readonly onReady?: (editor: LexionEditor) => void;
}

export interface LexionAngularAdapterUpdateOptions {
  readonly value?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
}

export type LexionAngularOnChange = (value: JSONDocument) => void;
export type LexionAngularOnTouched = () => void;

const noopChange: LexionAngularOnChange = () => {};
const noopTouched: LexionAngularOnTouched = () => {};
const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

export class LexionAngularAdapter {
  private readonly initialOptions: LexionAngularAdapterOptions;
  private webEditor: LexionWebEditor | null = null;
  private host: HTMLElement | null = null;
  private currentValue: JSONDocument | undefined;
  private currentReadOnly: boolean;
  private currentOnChange: ((value: JSONDocument, editor: LexionEditor) => void) | undefined;
  private formOnChange: LexionAngularOnChange;
  private formOnTouched: LexionAngularOnTouched;

  public constructor(options: LexionAngularAdapterOptions = {}) {
    this.initialOptions = options;
    this.currentValue = options.value;
    this.currentReadOnly = options.readOnly ?? false;
    this.currentOnChange = options.onChange;
    this.formOnChange = noopChange;
    this.formOnTouched = noopTouched;
  }

  public attach(element: HTMLElement): void {
    if (this.host === element && this.webEditor) {
      return;
    }

    this.detach();

    this.host = element;
    element.addEventListener("focusout", this.handleFocusOut);
    this.webEditor = createLexionWebEditor(this.buildWebEditorOptions(element));
  }

  public detach(): void {
    if (this.host) {
      this.host.removeEventListener("focusout", this.handleFocusOut);
      this.host = null;
    }

    this.webEditor?.destroy();
    this.webEditor = null;
  }

  public registerOnChange(handler: LexionAngularOnChange): void {
    this.formOnChange = handler;
  }

  public registerOnTouched(handler: LexionAngularOnTouched): void {
    this.formOnTouched = handler;
  }

  public markAsTouched(): void {
    this.formOnTouched();
  }

  public writeValue(value: JSONDocument): void {
    this.currentValue = value;
    this.webEditor?.update({ value });
  }

  public setDisabledState(disabled: boolean): void {
    this.currentReadOnly = disabled;
    this.webEditor?.update({ readOnly: disabled });
  }

  public update(options: LexionAngularAdapterUpdateOptions): void {
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

  public get editor(): LexionEditor | null {
    return this.webEditor?.editor ?? null;
  }

  public destroy(): void {
    this.detach();
  }

  private readonly handleChange = (value: JSONDocument, editor: LexionEditor): void => {
    this.currentValue = value;
    this.currentOnChange?.(value, editor);
    this.formOnChange(value);
  };

  private readonly handleFocusOut = (): void => {
    this.formOnTouched();
  };

  private buildWebEditorOptions(element: HTMLElement): LexionWebEditorOptions {
    return {
      element,
      readOnly: this.currentReadOnly,
      onChange: this.handleChange,
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

export const createLexionAngularAdapter = (
  options: LexionAngularAdapterOptions = {}
): LexionAngularAdapter => new LexionAngularAdapter(options);
