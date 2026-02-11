import { Node as ProseMirrorNode, Schema } from "prosemirror-model";
import { EditorState, type Transaction } from "prosemirror-state";
import type { CommandHandler, JSONDocument, LexionEditor as LexionEditorContract, LexionEditorOptions, LexionExtension } from "./types.js";
export declare class LexionEditor implements LexionEditorContract {
    private readonly _schema;
    private _state;
    private readonly commandMap;
    private readonly extensionsByKey;
    private readonly extensionCommandsByKey;
    private destroyed;
    constructor(options?: LexionEditorOptions);
    get schema(): Schema;
    get state(): EditorState;
    get doc(): ProseMirrorNode;
    getJSON(): JSONDocument;
    setJSON(document: JSONDocument): void;
    dispatchTransaction(transaction: Transaction): void;
    execute(command: string, ...args: readonly unknown[]): boolean;
    registerCommand(name: string, command: CommandHandler): void;
    unregisterCommand(name: string): void;
    use(extension: LexionExtension): void;
    removePlugin(key: string): void;
    destroy(): void;
    private assertNotDestroyed;
    private resolveSchema;
    private parseDocument;
    private createState;
    private addExtension;
    private createPluginLifecycleContext;
    private runExtensionOnCreate;
    private registerCommands;
}
//# sourceMappingURL=editor.d.ts.map