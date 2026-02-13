import { LexionEditor, type JSONDocument } from "@lexion/core";
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
export declare class LexionWebEditor {
    private readonly hostElement;
    private readonly ownsEditor;
    private readonly editorInstance;
    private readonly view;
    private readonly footerElement;
    private onChange;
    private isReadOnly;
    private lastAppliedValue;
    private destroyed;
    constructor(options: LexionWebEditorOptions);
    get editor(): LexionEditor;
    getJSON(): JSONDocument;
    execute(command: string, ...args: readonly unknown[]): boolean;
    setValue(value: JSONDocument): void;
    setReadOnly(readOnly: boolean): void;
    update(options: LexionWebEditorUpdateOptions): void;
    destroy(): void;
    private assertNotDestroyed;
}
export declare const createLexionWebEditor: (options: LexionWebEditorOptions) => LexionWebEditor;
//# sourceMappingURL=adapter.d.ts.map