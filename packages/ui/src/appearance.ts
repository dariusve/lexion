import type { LexionToolbarItemState } from "./types.js";

export const lexionToolbarAppearance = {
  className: "lexion-toolbar-ui",
  buttonClassName: "lexion-toolbar-ui__button",
  buttonEnabledClassName: "lexion-toolbar-ui__button--enabled",
  buttonDisabledClassName: "lexion-toolbar-ui__button--disabled",
  buttonHiddenClassName: "lexion-toolbar-ui__button--hidden",
  buttonActiveClassName: "lexion-toolbar-ui__button--active",
  iconClassName: "lexion-toolbar-ui__icon",
  labelClassName: "lexion-toolbar-ui__label",
  dropdownClassName: "lexion-toolbar-ui__dropdown",
  dropdownOpenClassName: "lexion-toolbar-ui__dropdown--open",
  dropdownMenuClassName: "lexion-toolbar-ui__dropdown-menu",
  dropdownItemClassName: "lexion-toolbar-ui__dropdown-item",
  dropdownCaretClassName: "lexion-toolbar-ui__dropdown-caret",
  separatorClassName: "lexion-toolbar-ui__separator",
  itemIdAttribute: "data-lexion-toolbar-item-id",
  dropdownOptionIdAttribute: "data-lexion-toolbar-dropdown-option-id",
  dropdownParentIdAttribute: "data-lexion-toolbar-dropdown-parent-id",
  stateAttribute: "data-lexion-toolbar-state",
  tooltipAttribute: "data-lexion-toolbar-tooltip"
} as const;

export const STATE_CLASS_NAMES: Readonly<Record<LexionToolbarItemState, string>> = {
  enabled: lexionToolbarAppearance.buttonEnabledClassName,
  disabled: lexionToolbarAppearance.buttonDisabledClassName,
  hidden: lexionToolbarAppearance.buttonHiddenClassName
};
