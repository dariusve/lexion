import { Node as ProseMirrorNode, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { coreSchema } from "./schema.js";
export class LexionEditor {
    _schema;
    _state;
    commandMap;
    extensionsByKey;
    extensionCommandsByKey;
    destroyed;
    constructor(options = {}) {
        const optionsExtensions = options.extensions ?? options.plugins ?? [];
        this._schema = this.resolveSchema(options.schema, optionsExtensions);
        this.commandMap = new Map();
        this.extensionsByKey = new Map();
        this.extensionCommandsByKey = new Map();
        this.destroyed = false;
        this.registerCommands(options.commands ?? {});
        for (const extension of optionsExtensions) {
            this.addExtension(extension);
        }
        const initialDoc = options.doc ? this.parseDocument(options.doc) : undefined;
        this._state = this.createState(initialDoc);
        this.runExtensionOnCreate();
    }
    get schema() {
        return this._schema;
    }
    get state() {
        return this._state;
    }
    get doc() {
        return this._state.doc;
    }
    getJSON() {
        return this._state.doc.toJSON();
    }
    setJSON(document) {
        this.assertNotDestroyed();
        const nextDocument = this.parseDocument(document);
        this._state = this.createState(nextDocument);
    }
    dispatchTransaction(transaction) {
        this.assertNotDestroyed();
        this._state = this._state.apply(transaction);
    }
    execute(command, ...args) {
        this.assertNotDestroyed();
        const handler = this.commandMap.get(command);
        if (!handler) {
            throw new Error(`Unknown command: ${command}`);
        }
        const context = {
            editor: this,
            schema: this._schema,
            state: this._state,
            dispatch: (transaction) => {
                this.dispatchTransaction(transaction);
            }
        };
        return handler(context, ...args);
    }
    registerCommand(name, command) {
        this.assertNotDestroyed();
        if (this.commandMap.has(name)) {
            throw new Error(`Command already registered: ${name}`);
        }
        this.commandMap.set(name, command);
    }
    unregisterCommand(name) {
        this.assertNotDestroyed();
        this.commandMap.delete(name);
    }
    use(extension) {
        this.assertNotDestroyed();
        this.addExtension(extension);
        this._state = this.createState(this._state.doc);
        this.runExtensionOnCreate([extension]);
    }
    removePlugin(key) {
        this.assertNotDestroyed();
        const extension = this.extensionsByKey.get(key);
        if (!extension) {
            return;
        }
        const lifecycleContext = this.createPluginLifecycleContext();
        extension.onDestroy?.(lifecycleContext);
        for (const commandName of this.extensionCommandsByKey.get(key) ?? []) {
            this.commandMap.delete(commandName);
        }
        this.extensionCommandsByKey.delete(key);
        this.extensionsByKey.delete(key);
        this._state = this.createState(this._state.doc);
    }
    destroy() {
        if (this.destroyed) {
            return;
        }
        const lifecycleContext = this.createPluginLifecycleContext();
        for (const extension of [...this.extensionsByKey.values()].reverse()) {
            extension.onDestroy?.(lifecycleContext);
        }
        this.commandMap.clear();
        this.extensionCommandsByKey.clear();
        this.extensionsByKey.clear();
        this.destroyed = true;
    }
    assertNotDestroyed() {
        if (this.destroyed) {
            throw new Error("LexionEditor instance has been destroyed");
        }
    }
    resolveSchema(explicitSchema, extensions) {
        if (explicitSchema) {
            return explicitSchema;
        }
        const schemaCandidates = [];
        for (const extension of extensions) {
            if (!extension.schema) {
                continue;
            }
            const schema = typeof extension.schema === "function" ? extension.schema() : extension.schema;
            schemaCandidates.push(schema);
        }
        if (schemaCandidates.length > 1) {
            throw new Error("Only one schema provider extension is supported per editor instance");
        }
        return schemaCandidates[0] ?? coreSchema;
    }
    parseDocument(document) {
        return ProseMirrorNode.fromJSON(this._schema, document);
    }
    createState(document) {
        const pluginContext = { schema: this._schema };
        const plugins = [];
        for (const extension of this.extensionsByKey.values()) {
            for (const prosemirrorPlugin of extension.prosemirrorPlugins?.(pluginContext) ?? []) {
                plugins.push(prosemirrorPlugin);
            }
        }
        const config = document
            ? {
                schema: this._schema,
                doc: document,
                plugins
            }
            : {
                schema: this._schema,
                plugins
            };
        return EditorState.create(config);
    }
    addExtension(extension) {
        if (this.extensionsByKey.has(extension.key)) {
            throw new Error(`Extension already registered: ${extension.key}`);
        }
        this.extensionsByKey.set(extension.key, extension);
        const commandNames = [];
        const extensionCommands = extension.commands?.({ schema: this._schema }) ?? {};
        for (const [name, handler] of Object.entries(extensionCommands)) {
            if (this.commandMap.has(name)) {
                throw new Error(`Command already registered: ${name}`);
            }
            this.commandMap.set(name, handler);
            commandNames.push(name);
        }
        this.extensionCommandsByKey.set(extension.key, commandNames);
    }
    createPluginLifecycleContext() {
        return {
            editor: this,
            schema: this._schema
        };
    }
    runExtensionOnCreate(extensions) {
        const lifecycleContext = this.createPluginLifecycleContext();
        for (const extension of extensions ?? this.extensionsByKey.values()) {
            extension.onCreate?.(lifecycleContext);
        }
    }
    registerCommands(commands) {
        for (const [name, command] of Object.entries(commands)) {
            this.registerCommand(name, command);
        }
    }
}
//# sourceMappingURL=editor.js.map