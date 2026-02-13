import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
import {
  createLexionWebEditor,
  type LexionWebEditor,
  type LexionWebEditorOptions
} from "@lexion-rte/web";

export interface LexionSvelteActionOptions {
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  readonly onReady?: (editor: LexionEditor) => void;
}

export interface LexionSvelteAction {
  readonly update: (options: LexionSvelteActionOptions) => void;
  readonly destroy: () => void;
}

const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const buildWebEditor = (
  element: HTMLElement,
  options: LexionSvelteActionOptions,
  onChange: (value: JSONDocument, editor: LexionEditor) => void
): LexionWebEditor => {
  const editorOptions: LexionWebEditorOptions = {
    element,
    onChange,
    ...(options.editor !== undefined ? { editor: options.editor } : {}),
    ...(options.value !== undefined ? { value: options.value } : {}),
    ...(options.defaultValue !== undefined
      ? { defaultValue: options.defaultValue }
      : {}),
    ...(options.readOnly !== undefined ? { readOnly: options.readOnly } : {}),
    ...(options.onReady !== undefined ? { onReady: options.onReady } : {})
  };

  return createLexionWebEditor(editorOptions);
};

export const lexion = (
  element: HTMLElement,
  options: LexionSvelteActionOptions = {}
): LexionSvelteAction => {
  let currentOptions = options;
  const onChange = (value: JSONDocument, editor: LexionEditor): void => {
    currentOptions.onChange?.(value, editor);
  };

  let webEditor = buildWebEditor(element, currentOptions, onChange);

  return {
    update(nextOptions: LexionSvelteActionOptions): void {
      const editorChanged = nextOptions.editor !== undefined && nextOptions.editor !== currentOptions.editor;
      currentOptions = {
        ...currentOptions,
        ...nextOptions
      };

      if (editorChanged) {
        webEditor.destroy();
        webEditor = buildWebEditor(element, currentOptions, onChange);
        return;
      }

      const updateOptions: {
        value?: JSONDocument;
        readOnly?: boolean;
      } = {};

      if (hasOwn(nextOptions, "value") && currentOptions.value !== undefined) {
        updateOptions.value = currentOptions.value;
      }

      if (hasOwn(nextOptions, "readOnly") && currentOptions.readOnly !== undefined) {
        updateOptions.readOnly = currentOptions.readOnly;
      }

      webEditor.update(updateOptions);
    },
    destroy(): void {
      webEditor.destroy();
    }
  };
};
