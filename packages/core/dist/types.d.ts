import type { Node as ProseMirrorNode, Schema } from "prosemirror-model";
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
    readonly plugins?: readonly LexionPlugin[];
    readonly commands?: CommandMap;
}
export interface PluginFactoryContext {
    readonly schema: Schema;
}
export interface PluginLifecycleContext extends PluginFactoryContext {
    readonly editor: LexionEditor;
}
export interface EditorCommandContext {
    readonly editor: LexionEditor;
    readonly schema: Schema;
    readonly state: EditorState;
    readonly dispatch: (transaction: Transaction) => void;
}
export type CommandHandler = (context: EditorCommandContext, ...args: readonly unknown[]) => boolean;
export type CommandMap = Readonly<Record<string, CommandHandler>>;
export interface LexionExtension {
    readonly key: string;
    readonly schema?: Schema | (() => Schema);
    readonly prosemirrorPlugins?: (context: PluginFactoryContext) => readonly Plugin[];
    readonly commands?: (context: PluginFactoryContext) => CommandMap;
    readonly onCreate?: (context: PluginLifecycleContext) => void;
    readonly onDestroy?: (context: PluginLifecycleContext) => void;
}
export type LexionPlugin = LexionExtension;
export interface LexionEditor {
    readonly schema: Schema;
    readonly state: EditorState;
    readonly doc: ProseMirrorNode;
    getJSON: () => JSONDocument;
    setJSON: (document: JSONDocument) => void;
    dispatchTransaction: (transaction: Transaction) => void;
    execute: (command: string, ...args: readonly unknown[]) => boolean;
    registerCommand: (name: string, command: CommandHandler) => void;
    unregisterCommand: (name: string) => void;
    use: (extension: LexionExtension) => void;
    removePlugin: (key: string) => void;
    destroy: () => void;
}
//# sourceMappingURL=types.d.ts.map