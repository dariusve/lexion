import type { LexionStatusBarAlignment, LexionStatusBarItem } from "./types.js";

export interface LexionStatusBarAppearance {
  readonly className: "lexion-editor-status-bar";
  readonly groupClassName: "lexion-editor-status-bar-group";
  readonly itemClassName: "lexion-editor-status-item";
  readonly style: Readonly<Record<string, string>>;
  readonly groupStyles: Readonly<Record<LexionStatusBarAlignment, Readonly<Record<string, string>>>>;
}

export const lexionStatusBarAppearance: LexionStatusBarAppearance = {
  className: "lexion-editor-status-bar",
  groupClassName: "lexion-editor-status-bar-group",
  itemClassName: "lexion-editor-status-item",
  style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "8px 12px",
    borderRight: "1px solid #cbd5e1",
    borderBottom: "1px solid #cbd5e1",
    borderLeft: "1px solid #cbd5e1",
    background: "transparent",
    color: "rgb(79,79,79)",
    fontSize: "7.5px",
    lineHeight: "1.3",
    overflowWrap: "break-word",
    textWrapMode: "nowrap",
  },
  groupStyles: {
    start: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: "0"
    },
    end: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "12px",
      minWidth: "0"
    }
  }
};

export const lexionBrandingStatusItem: LexionStatusBarItem = {
  key: "branding",
  text: "Powered by lexion",
  align: "end",
  style: {
    fontSize: "7.5px",
    fontFamily: "Helvetica, Arial, Tahoma, Verdana, sans-serif",
    fontWeight: "700",
    letterSpacing: "-0.2px",
    textTransform: "uppercase"
  }
};
