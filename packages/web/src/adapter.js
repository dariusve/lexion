import { LexionEditor } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";
import { EditorView } from "prosemirror-view";
const serializeJSON = (document) => JSON.stringify(document);
const FOOTER_TEXT = "Open Source Limited Version";
const createFooterElement = (host) => {
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
    hostElement;
    ownsEditor;
    editorInstance;
    view;
    footerElement;
    onChange;
    isReadOnly;
    lastAppliedValue;
    destroyed;
    constructor(options) {
        this.hostElement = options.element;
        this.ownsEditor = options.editor === undefined;
        if (options.editor) {
            this.editorInstance = options.editor;
        }
        else {
            const editorOptions = options.defaultValue === undefined
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
    get editor() {
        return this.editorInstance;
    }
    getJSON() {
        this.assertNotDestroyed();
        return this.editorInstance.getJSON();
    }
    execute(command, ...args) {
        this.assertNotDestroyed();
        const executed = this.editorInstance.execute(command, ...args);
        this.view.updateState(this.editorInstance.state);
        const nextValue = this.editorInstance.getJSON();
        this.lastAppliedValue = serializeJSON(nextValue);
        this.onChange?.(nextValue, this.editorInstance);
        return executed;
    }
    setValue(value) {
        this.assertNotDestroyed();
        const serialized = serializeJSON(value);
        if (serialized === this.lastAppliedValue) {
            return;
        }
        this.editorInstance.setJSON(value);
        this.lastAppliedValue = serialized;
        this.view.updateState(this.editorInstance.state);
    }
    setReadOnly(readOnly) {
        this.assertNotDestroyed();
        this.isReadOnly = readOnly;
        this.view.setProps({
            editable: () => !this.isReadOnly
        });
    }
    update(options) {
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
    destroy() {
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
    assertNotDestroyed() {
        if (this.destroyed) {
            throw new Error("LexionWebEditor has been destroyed");
        }
    }
}
export const createLexionWebEditor = (options) => new LexionWebEditor(options);
//# sourceMappingURL=adapter.js.map