import { lexionStatusBarStyles } from "@lexion-rte/core";

export interface LexionWebEditorStyleInjectionOptions {
  readonly document?: Document;
  readonly id?: string;
  readonly target?: HTMLElement;
}

/**
 * Inline style ProseMirror requires on its root element. It is set as an attribute (not only
 * via the stylesheet) so the view works even when stylesheet injection is disabled, and so
 * ProseMirror does not warn about a missing `prosemirror.css`.
 */
export const EDITOR_REQUIRED_STYLE_ATTRIBUTE =
  "white-space: pre-wrap !important; word-wrap: break-word !important; -webkit-font-variant-ligatures: none; font-variant-ligatures: none;";

/** @deprecated Use `EDITOR_REQUIRED_STYLE_ATTRIBUTE` instead. */
export const PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE = EDITOR_REQUIRED_STYLE_ATTRIBUTE;

export const lexionWebEditorStyles = `
.ProseMirror {
  position: relative;
  white-space: pre-wrap;
  word-wrap: break-word;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
}

.ProseMirror:focus {
  outline: none;
}

.ProseMirror pre {
  white-space: pre-wrap;
}
${lexionStatusBarStyles}`;

const getDefaultDocument = (): Document => {
  if (typeof document !== "undefined") {
    return document;
  }

  throw new Error(
    "A DOM Document is required. Pass { document } when running outside the browser."
  );
};

export const injectLexionWebEditorStyles = (
  options: LexionWebEditorStyleInjectionOptions = {}
): HTMLStyleElement => {
  const documentNode = options.document ?? getDefaultDocument();
  const styleId = options.id ?? "lexion-web-editor-styles";
  const existing = documentNode.getElementById(styleId);
  if (existing && existing.tagName.toLowerCase() === "style") {
    return existing as HTMLStyleElement;
  }

  const style = documentNode.createElement("style");
  style.id = styleId;
  style.textContent = lexionWebEditorStyles;
  // Insert first so user stylesheets that follow take precedence on equal specificity.
  const target = options.target ?? documentNode.head ?? documentNode.documentElement;
  target.insertBefore(style, target.firstChild);
  return style;
};
