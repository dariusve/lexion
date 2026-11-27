export { LexionEditor } from "./editor.js";
export {
  LEXION_BRANDING_CLASS_NAME,
  getStatusBarGroupClassName,
  getStatusBarItemClassName,
  lexionBrandingStatusItem,
  lexionStatusBarAppearance,
  lexionStatusBarStyles,
  resolveBrandingStatusItem,
  splitStatusBarItems
} from "./branding.js";
export { createCoreSchema, coreSchema } from "./schema.js";
export type {
  CommandHandler,
  CommandMap,
  EditorCommandContext,
  JSONDocument,
  JSONArray,
  JSONObject,
  JSONPrimitive,
  JSONValue,
  LexionBrandingOptions,
  LexionEditorOptions,
  LexionEditorUpdateEvent,
  LexionEditorUpdateListener,
  LexionEditorUpdateSource,
  LexionExtension,
  LexionPlugin,
  LexionStatusBarAlignment,
  LexionStatusBarItem,
  PluginFactoryContext,
  PluginLifecycleContext,
  StatusBarContext
} from "./types.js";
export type { LexionStatusBarAppearance, LexionStatusBarGroups } from "./branding.js";
