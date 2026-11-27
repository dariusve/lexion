import type { Node as DocNode, Schema } from "prosemirror-model";
import type { Plugin, EditorState, Transaction } from "prosemirror-state";

export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export interface JSONObject {
  readonly [key: string]: JSONValue;
}
export type JSONArray = readonly JSONValue[];
export type JSONDocument = JSONObject;

export interface LexionEditorOptions {
  readonly schema?: Schema;
  readonly doc?: JSONDocument;
  readonly extensions?: readonly LexionExtension[];
  /** @deprecated Use `extensions` instead. */
  readonly plugins?: readonly LexionPlugin[];
  readonly commands?: CommandMap;
  /**
   * Controls the "Powered by lexion" status bar item. `false` hides it; an object
   * customizes it. Defaults to the standard item.
   */
  readonly branding?: boolean | LexionBrandingOptions;
}

export interface LexionBrandingOptions {
  readonly text?: string;
  readonly align?: LexionStatusBarAlignment;
  readonly className?: string;
  readonly style?: Readonly<Record<string, string>>;
}

export interface PluginFactoryContext {
  readonly schema: Schema;
}

export interface PluginLifecycleContext extends PluginFactoryContext {
  readonly editor: LexionEditor;
}

export type LexionStatusBarAlignment = "start" | "end";

export interface LexionStatusBarItem {
  readonly key: string;
  readonly text: string;
  readonly align?: LexionStatusBarAlignment;
  readonly className?: string;
  readonly style?: Readonly<Record<string, string>>;
}

export interface StatusBarContext extends PluginLifecycleContext {
  readonly state: EditorState;
  readonly doc: DocNode;
}

export interface EditorCommandContext {
  readonly editor: LexionEditor;
  readonly schema: Schema;
  readonly state: EditorState;
  readonly dispatch: (transaction: Transaction) => void;
}

export type CommandHandler = (
  context: EditorCommandContext,
  ...args: readonly unknown[]
) => boolean;

export type CommandMap = Readonly<Record<string, CommandHandler>>;

export interface LexionExtension {
  readonly key: string;
  readonly schema?: Schema | (() => Schema);
  readonly editorPlugins?: (context: PluginFactoryContext) => readonly Plugin[];
  /** @deprecated Use `editorPlugins` instead. */
  readonly prosemirrorPlugins?: (context: PluginFactoryContext) => readonly Plugin[];
  readonly commands?: (context: PluginFactoryContext) => CommandMap;
  readonly statusBarItems?: (context: StatusBarContext) => readonly LexionStatusBarItem[];
  readonly onCreate?: (context: PluginLifecycleContext) => void;
  readonly onDestroy?: (context: PluginLifecycleContext) => void;
}

/** @deprecated Use `LexionExtension` instead. */
export type LexionPlugin = LexionExtension;

/**
 * What caused an editor update:
 * - `transaction`: a ProseMirror transaction was dispatched (user input or a command)
 * - `setJSON`: the document was replaced via `setJSON()`
 * - `extensions`: an extension was added or removed, which rebuilds the state (the document is kept)
 */
export type LexionEditorUpdateSource = "transaction" | "setJSON" | "extensions";

export interface LexionEditorUpdateEvent {
  readonly editor: LexionEditor;
  readonly source: LexionEditorUpdateSource;
  /** The dispatched transaction, or `null` when `source` is not `"transaction"`. */
  readonly transaction: Transaction | null;
  readonly previousState: EditorState;
  readonly state: EditorState;
  /** `true` when the document content changed (not just the selection or stored marks). */
  readonly docChanged: boolean;
}

export type LexionEditorUpdateListener = (event: LexionEditorUpdateEvent) => void;

export interface LexionEditor {
  readonly schema: Schema;
  readonly state: EditorState;
  readonly doc: DocNode;
  readonly isDestroyed: boolean;
  getJSON: () => JSONDocument;
  getStatusBarItems: () => readonly LexionStatusBarItem[];
  setJSON: (document: JSONDocument) => void;
  dispatchTransaction: (transaction: Transaction) => void;
  execute: (command: string, ...args: readonly unknown[]) => boolean;
  registerCommand: (name: string, command: CommandHandler) => void;
  unregisterCommand: (name: string) => void;
  use: (extension: LexionExtension) => void;
  removeExtension: (key: string) => void;
  /** @deprecated Use `removeExtension` instead. */
  removePlugin: (key: string) => void;
  subscribe: (listener: LexionEditorUpdateListener) => () => void;
  destroy: () => void;
}
