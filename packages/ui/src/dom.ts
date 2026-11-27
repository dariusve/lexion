import { STATE_CLASS_NAMES, lexionToolbarAppearance } from "./appearance.js";
import type {
  LexionToolbarDropdownOption,
  LexionToolbarItemState,
  ToolbarItemRecord
} from "./types.js";

export const clearElement = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

export const applyButtonState = (
  button: HTMLButtonElement,
  state: LexionToolbarItemState
): void => {
  button.classList.remove(
    lexionToolbarAppearance.buttonEnabledClassName,
    lexionToolbarAppearance.buttonDisabledClassName,
    lexionToolbarAppearance.buttonHiddenClassName
  );
  button.classList.add(STATE_CLASS_NAMES[state]);
  button.setAttribute(lexionToolbarAppearance.stateAttribute, state);
  if (state === "enabled") {
    button.disabled = false;
    button.hidden = false;
    return;
  }
  if (state === "disabled") {
    button.disabled = true;
    button.hidden = false;
    return;
  }
  button.disabled = true;
  button.hidden = true;
};

export const createButtonElement = (
  documentNode: Document,
  item: ToolbarItemRecord
): HTMLButtonElement => {
  if (item.iconClass === undefined) {
    throw new Error(`Toolbar button item "${item.id}" is missing iconClass.`);
  }
  const button = documentNode.createElement("button");
  button.type = "button";
  button.className = lexionToolbarAppearance.buttonClassName;
  button.setAttribute(lexionToolbarAppearance.itemIdAttribute, item.id);
  const tooltipText = item.title ?? item.label ?? item.id;
  button.setAttribute("aria-label", tooltipText);
  button.setAttribute(lexionToolbarAppearance.tooltipAttribute, tooltipText);

  const icon = documentNode.createElement("i");
  icon.className = `${lexionToolbarAppearance.iconClassName} ${item.iconClass}`;
  icon.setAttribute("aria-hidden", "true");
  button.appendChild(icon);

  if (item.label !== undefined) {
    const label = documentNode.createElement("span");
    label.className = lexionToolbarAppearance.labelClassName;
    label.textContent = item.label;
    button.appendChild(label);
  }

  // Toggle buttons expose their state; dropdown triggers use aria-expanded instead.
  if (item.active !== undefined && item.items === undefined) {
    button.setAttribute("aria-pressed", item.active ? "true" : "false");
    button.classList.toggle(lexionToolbarAppearance.buttonActiveClassName, item.active);
  }

  applyButtonState(button, item.state);
  return button;
};

export const createSeparatorElement = (
  documentNode: Document,
  item: ToolbarItemRecord
): HTMLDivElement => {
  const separator = documentNode.createElement("div");
  separator.className = lexionToolbarAppearance.separatorClassName;
  separator.setAttribute(lexionToolbarAppearance.itemIdAttribute, item.id);
  separator.setAttribute(lexionToolbarAppearance.stateAttribute, item.state);
  separator.setAttribute("role", "separator");
  separator.setAttribute("aria-orientation", "vertical");
  if (item.state === "hidden") {
    separator.hidden = true;
  }
  return separator;
};

export const applyDropdownOptionState = (
  button: HTMLButtonElement,
  state: LexionToolbarItemState
): void => {
  button.setAttribute(lexionToolbarAppearance.stateAttribute, state);
  if (state === "enabled") {
    button.disabled = false;
    button.hidden = false;
    return;
  }
  if (state === "disabled") {
    button.disabled = true;
    button.hidden = false;
    return;
  }
  button.disabled = true;
  button.hidden = true;
};

export const createDropdownOptionButton = (
  documentNode: Document,
  parentId: string,
  option: LexionToolbarDropdownOption
): HTMLButtonElement => {
  const button = documentNode.createElement("button");
  button.type = "button";
  button.className = lexionToolbarAppearance.dropdownItemClassName;
  button.setAttribute("role", "menuitem");
  button.tabIndex = -1;
  button.setAttribute(lexionToolbarAppearance.dropdownParentIdAttribute, parentId);
  button.setAttribute(lexionToolbarAppearance.dropdownOptionIdAttribute, option.id);
  const tooltipText = option.title ?? option.label ?? option.id;
  button.setAttribute("aria-label", tooltipText);
  button.setAttribute(lexionToolbarAppearance.tooltipAttribute, tooltipText);

  const icon = documentNode.createElement("i");
  icon.className = `${lexionToolbarAppearance.iconClassName} ${option.iconClass}`;
  icon.setAttribute("aria-hidden", "true");
  button.appendChild(icon);

  const label = documentNode.createElement("span");
  label.className = lexionToolbarAppearance.labelClassName;
  label.textContent = option.label;
  button.appendChild(label);

  applyDropdownOptionState(button, option.state);
  return button;
};

export const createDropdownElement = (
  documentNode: Document,
  item: ToolbarItemRecord
): HTMLDivElement => {
  const wrapper = documentNode.createElement("div");
  wrapper.className = lexionToolbarAppearance.dropdownClassName;
  wrapper.setAttribute(lexionToolbarAppearance.itemIdAttribute, item.id);
  wrapper.setAttribute(lexionToolbarAppearance.stateAttribute, item.state);

  const trigger = createButtonElement(documentNode, item);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  if (item.items !== undefined) {
    const caret = documentNode.createElement("span");
    caret.className = lexionToolbarAppearance.dropdownCaretClassName;
    caret.textContent = "▾";
    trigger.appendChild(caret);
  }
  wrapper.appendChild(trigger);

  const menu = documentNode.createElement("div");
  menu.className = lexionToolbarAppearance.dropdownMenuClassName;
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", item.title ?? item.label ?? item.id);
  for (const option of item.items ?? []) {
    menu.appendChild(createDropdownOptionButton(documentNode, item.id, option));
  }
  wrapper.appendChild(menu);

  if (item.state === "hidden") {
    wrapper.hidden = true;
  }

  return wrapper;
};
