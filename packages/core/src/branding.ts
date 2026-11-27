import type {
  LexionBrandingOptions,
  LexionStatusBarAlignment,
  LexionStatusBarItem
} from "./types.js";

export interface LexionStatusBarAppearance {
  readonly className: "lexion-editor-status-bar";
  readonly groupClassName: "lexion-editor-status-bar-group";
  readonly itemClassName: "lexion-editor-status-item";
  /**
   * @deprecated Status bar styling now comes from `lexionStatusBarStyles` (CSS classes),
   * so it can be themed. Kept for consumers that still apply inline styles.
   */
  readonly style: Readonly<Record<string, string>>;
  /** @deprecated See `style`. */
  readonly groupStyles: Readonly<
    Record<LexionStatusBarAlignment, Readonly<Record<string, string>>>
  >;
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
    padding: "6px 12px",
    borderRight: "1px solid #cbd5e1",
    borderBottom: "1px solid #cbd5e1",
    borderLeft: "1px solid #cbd5e1",
    background: "transparent",
    color: "rgb(79,79,79)",
    fontSize: "11px",
    lineHeight: "1.3",
    whiteSpace: "nowrap"
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

export const LEXION_BRANDING_CLASS_NAME = "lexion-editor-status-item--branding";

/**
 * Default status bar styles. Selectors are wrapped in `:where()` (zero specificity), so any
 * user rule targeting the same classes wins without `!important`. Theme via the
 * `--lexion-status-bar-*` custom properties or by overriding the classes.
 */
export const lexionStatusBarStyles = `
:where(.lexion-editor-status-bar) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: var(--lexion-status-bar-padding, 6px 12px);
  border: 1px solid var(--lexion-status-bar-border-color, #cbd5e1);
  border-top: none;
  background: var(--lexion-status-bar-background, transparent);
  color: var(--lexion-status-bar-color, rgb(79, 79, 79));
  font-size: var(--lexion-status-bar-font-size, 11px);
  line-height: 1.3;
  white-space: nowrap;
}

:where(.lexion-editor-status-bar-group) {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

:where(.lexion-editor-status-bar-group--end) {
  justify-content: flex-end;
}

:where(.lexion-editor-status-item) {
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.${LEXION_BRANDING_CLASS_NAME}) {
  font-family: Helvetica, Arial, Tahoma, Verdana, sans-serif;
  font-size: var(--lexion-status-bar-font-size, 11px);
  font-weight: 700;
  letter-spacing: -0.2px;
  text-transform: uppercase;
}
`;

export const lexionBrandingStatusItem: LexionStatusBarItem = {
  key: "branding",
  text: "Powered by lexion",
  align: "end",
  className: LEXION_BRANDING_CLASS_NAME
};

/** Resolves the branding item for `LexionEditorOptions.branding`, or `null` when hidden. */
export const resolveBrandingStatusItem = (
  branding: boolean | LexionBrandingOptions | undefined
): LexionStatusBarItem | null => {
  if (branding === false) {
    return null;
  }
  if (branding === undefined || branding === true) {
    return lexionBrandingStatusItem;
  }

  const className = branding.className
    ? `${LEXION_BRANDING_CLASS_NAME} ${branding.className}`
    : LEXION_BRANDING_CLASS_NAME;
  return {
    ...lexionBrandingStatusItem,
    ...(branding.text !== undefined ? { text: branding.text } : {}),
    ...(branding.align !== undefined ? { align: branding.align } : {}),
    ...(branding.style !== undefined ? { style: branding.style } : {}),
    className
  };
};

export interface LexionStatusBarGroups {
  readonly start: readonly LexionStatusBarItem[];
  readonly end: readonly LexionStatusBarItem[];
}

export const splitStatusBarItems = (
  items: readonly LexionStatusBarItem[]
): LexionStatusBarGroups => ({
  start: items.filter((item) => (item.align ?? "start") === "start"),
  end: items.filter((item) => item.align === "end")
});

export const getStatusBarGroupClassName = (align: LexionStatusBarAlignment): string =>
  `${lexionStatusBarAppearance.groupClassName} ${lexionStatusBarAppearance.groupClassName}--${align}`;

export const getStatusBarItemClassName = (item: LexionStatusBarItem): string =>
  item.className
    ? `${lexionStatusBarAppearance.itemClassName} ${item.className}`
    : lexionStatusBarAppearance.itemClassName;
