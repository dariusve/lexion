import { lexionToolbarAppearance } from "./appearance.js";
import type { LexionToolbarStyleInjectionOptions } from "./types.js";

const getDefaultDocument = (): Document => {
  if (typeof document !== "undefined") {
    return document;
  }

  throw new Error(
    "A DOM Document is required. Pass { document } when running outside the browser."
  );
};

export const lexionToolbarStyles = `
.${lexionToolbarAppearance.className} {
  --lexion-toolbar-bg: linear-gradient(180deg, #fdfefe 0%, #eef2f7 100%);
  --lexion-toolbar-border: #cdd5df;
  --lexion-toolbar-button-bg: #ffffff;
  --lexion-toolbar-button-border: #c6cfda;
  --lexion-toolbar-button-border-hover: #95a7bc;
  --lexion-toolbar-button-bg-hover: #f2f5f9;
  --lexion-toolbar-button-bg-active: #e8edf4;
  --lexion-toolbar-focus: #3b82f6;
  --lexion-toolbar-text: #1f2937;
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  padding: 0;
  border: 1px solid var(--lexion-toolbar-border);
  border-radius: 0;
  background: var(--lexion-toolbar-bg);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 1px 2px rgba(15, 23, 42, 0.08);
}

.${lexionToolbarAppearance.buttonClassName} {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 30px;
  min-width: 30px;
  border: 0;
  border-radius: 0;
  background: var(--lexion-toolbar-button-bg);
  color: var(--lexion-toolbar-text);
  padding: 0 8px;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
}

.${lexionToolbarAppearance.dropdownClassName} {
  position: relative;
  display: inline-flex;
}

.${lexionToolbarAppearance.dropdownCaretClassName} {
  font-size: 10px;
  line-height: 1;
  margin-left: 2px;
}

.${lexionToolbarAppearance.buttonClassName}:hover:not(:disabled) {
  background: var(--lexion-toolbar-button-bg-hover);
}

.${lexionToolbarAppearance.buttonClassName}:active:not(:disabled) {
  background: var(--lexion-toolbar-button-bg-active);
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.15);
}

.${lexionToolbarAppearance.buttonClassName}:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.22);
}

.${lexionToolbarAppearance.buttonClassName}::after {
  content: attr(${lexionToolbarAppearance.tooltipAttribute});
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  transform: translateX(-50%) translateY(-2px);
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1;
  color: #f8fafc;
  background: #111827;
  border: 1px solid #0b1220;
  border-radius: 0;
  padding: 4px 6px;
  z-index: 20;
  transition: opacity 120ms ease, transform 120ms ease;
}

.${lexionToolbarAppearance.buttonClassName}:hover::after,
.${lexionToolbarAppearance.buttonClassName}:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.${lexionToolbarAppearance.dropdownMenuClassName} {
  position: absolute;
  left: 0;
  top: calc(100% + 2px);
  min-width: 190px;
  display: none;
  flex-direction: column;
  border: 1px solid #cdd5df;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.16);
  z-index: 30;
}

.${lexionToolbarAppearance.dropdownOpenClassName} .${lexionToolbarAppearance.dropdownMenuClassName} {
  display: flex;
}

.${lexionToolbarAppearance.dropdownItemClassName} {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 32px;
  border: 0;
  border-radius: 0;
  padding: 0 10px;
  text-align: left;
  font: inherit;
  font-size: 12px;
  color: var(--lexion-toolbar-text);
  background: #ffffff;
  cursor: pointer;
}

.${lexionToolbarAppearance.dropdownItemClassName}:hover:not(:disabled),
.${lexionToolbarAppearance.dropdownItemClassName}:focus-visible:not(:disabled) {
  background: #eef2f7;
  outline: none;
}

.${lexionToolbarAppearance.dropdownItemClassName}[${lexionToolbarAppearance.stateAttribute}="disabled"] {
  opacity: 0.5;
  cursor: not-allowed;
}

.${lexionToolbarAppearance.separatorClassName} {
  width: 1px;
  min-height: 22px;
  margin: 0 4px;
  background: #cdd5df;
}

.${lexionToolbarAppearance.separatorClassName}[${lexionToolbarAppearance.stateAttribute}="disabled"] {
  opacity: 0.45;
}

.${lexionToolbarAppearance.buttonEnabledClassName} {
  opacity: 1;
}

.${lexionToolbarAppearance.buttonDisabledClassName} {
  opacity: 0.45;
  filter: saturate(0.7);
  cursor: not-allowed;
}

.${lexionToolbarAppearance.buttonHiddenClassName} {
  display: none !important;
}

.${lexionToolbarAppearance.iconClassName} {
  font-size: 19px;
  line-height: 1;
}

.${lexionToolbarAppearance.labelClassName} {
  font-size: 12px;
  letter-spacing: 0.01em;
  line-height: 1;
}

.${lexionToolbarAppearance.buttonActiveClassName} {
  background: var(--lexion-toolbar-button-bg-active);
}

.${lexionToolbarAppearance.buttonClassName}:focus-visible,
.${lexionToolbarAppearance.dropdownItemClassName}:focus-visible {
  outline: 2px solid var(--lexion-toolbar-focus-ring, #2563eb);
  outline-offset: 1px;
}
`;

export const injectLexionToolbarStyles = (
  options: LexionToolbarStyleInjectionOptions = {}
): HTMLStyleElement => {
  const documentNode = options.document ?? getDefaultDocument();
  const styleId = options.id ?? "lexion-toolbar-ui-styles";
  const existing = documentNode.getElementById(styleId);
  if (existing && existing.tagName.toLowerCase() === "style") {
    return existing as HTMLStyleElement;
  }

  const style = documentNode.createElement("style");
  style.id = styleId;
  style.textContent = lexionToolbarStyles;
  const target = options.target ?? documentNode.head ?? documentNode.documentElement;
  target.appendChild(style);
  return style;
};
