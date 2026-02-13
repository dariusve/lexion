import { Node as ProseMirrorNode, type Schema } from "prosemirror-model";
import { EditorState, type Plugin, type Transaction } from "prosemirror-state";

import { coreSchema } from "./schema.js";
import type {
  CommandHandler,
  CommandMap,
  EditorCommandContext,
  JSONDocument,
  LexionEditor as LexionEditorContract,
  LexionEditorOptions,
  LexionExtension,
  PluginFactoryContext,
  PluginLifecycleContext
} from "./types.js";

export class LexionEditor implements LexionEditorContract {
  private readonly _schema: Schema;
  private _state: EditorState;
  private readonly commandMap: Map<string, CommandHandler>;
  private readonly extensionsByKey: Map<string, LexionExtension>;
  private readonly extensionCommandsByKey: Map<string, readonly string[]>;
  private destroyed: boolean;

  public constructor(options: LexionEditorOptions = {}) {
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

  public get schema(): Schema {
    return this._schema;
  }

  public get state(): EditorState {
    return this._state;
  }

  public get doc(): ProseMirrorNode {
    return this._state.doc;
  }

  public getJSON(): JSONDocument {
    return this._state.doc.toJSON() as JSONDocument;
  }

  public setJSON(document: JSONDocument): void {
    this.assertNotDestroyed();
    const nextDocument = this.parseDocument(document);
    this._state = this.createState(nextDocument);
  }

  public dispatchTransaction(transaction: Transaction): void {
    this.assertNotDestroyed();
    this._state = this._state.apply(transaction);
  }

  public execute(command: string, ...args: readonly unknown[]): boolean {
    this.assertNotDestroyed();
    const handler = this.commandMap.get(command);
    if (!handler) {
      throw new Error(`Unknown command: ${command}`);
    }

    const context: EditorCommandContext = {
      editor: this,
      schema: this._schema,
      state: this._state,
      dispatch: (transaction: Transaction): void => {
        this.dispatchTransaction(transaction);
      }
    };

    return handler(context, ...args);
  }

  public registerCommand(name: string, command: CommandHandler): void {
    this.assertNotDestroyed();
    if (this.commandMap.has(name)) {
      throw new Error(`Command already registered: ${name}`);
    }
    this.commandMap.set(name, command);
  }

  public unregisterCommand(name: string): void {
    this.assertNotDestroyed();
    this.commandMap.delete(name);
  }

  public use(extension: LexionExtension): void {
    this.assertNotDestroyed();
    const previousState = this._state;
    this.addExtension(extension);

    try {
      this._state = this.createState(this._state.doc);
      this.runExtensionOnCreate([extension]);
    } catch (error) {
      for (const commandName of this.extensionCommandsByKey.get(extension.key) ?? []) {
        this.commandMap.delete(commandName);
      }
      this.extensionCommandsByKey.delete(extension.key);
      this.extensionsByKey.delete(extension.key);
      this._state = previousState;
      throw error;
    }
  }

  public removePlugin(key: string): void {
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

  public destroy(): void {
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

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error("LexionEditor instance has been destroyed");
    }
  }

  private resolveSchema(
    explicitSchema: Schema | undefined,
    extensions: readonly LexionExtension[]
  ): Schema {
    if (explicitSchema) {
      return explicitSchema;
    }

    const schemaCandidates: Schema[] = [];
    for (const extension of extensions) {
      if (!extension.schema) {
        continue;
      }
      const schema =
        typeof extension.schema === "function" ? extension.schema() : extension.schema;
      schemaCandidates.push(schema);
    }

    if (schemaCandidates.length > 1) {
      throw new Error("Only one schema provider extension is supported per editor instance");
    }

    return schemaCandidates[0] ?? coreSchema;
  }

  private parseDocument(document: JSONDocument): ProseMirrorNode {
    return ProseMirrorNode.fromJSON(this._schema, document as unknown as Record<string, unknown>);
  }

  private createState(document?: ProseMirrorNode): EditorState {
    const pluginContext: PluginFactoryContext = { schema: this._schema };
    const plugins: Plugin[] = [];

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

  private addExtension(extension: LexionExtension): void {
    if (this.extensionsByKey.has(extension.key)) {
      throw new Error(`Extension already registered: ${extension.key}`);
    }

    const extensionCommands = extension.commands?.({ schema: this._schema }) ?? {};
    const commandNames = Object.keys(extensionCommands);

    for (const name of commandNames) {
      if (this.commandMap.has(name)) {
        throw new Error(`Command already registered: ${name}`);
      }
    }

    this.extensionsByKey.set(extension.key, extension);

    for (const [name, handler] of Object.entries(extensionCommands)) {
      this.commandMap.set(name, handler);
    }

    this.extensionCommandsByKey.set(extension.key, commandNames);
  }

  private createPluginLifecycleContext(): PluginLifecycleContext {
    return {
      editor: this,
      schema: this._schema
    };
  }

  private runExtensionOnCreate(extensions?: readonly LexionExtension[]): void {
    const lifecycleContext = this.createPluginLifecycleContext();
    for (const extension of extensions ?? this.extensionsByKey.values()) {
      extension.onCreate?.(lifecycleContext);
    }
  }

  private registerCommands(commands: CommandMap): void {
    for (const [name, command] of Object.entries(commands)) {
      this.registerCommand(name, command);
    }
  }
}
