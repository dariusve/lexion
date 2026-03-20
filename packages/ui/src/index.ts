import type { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";

export type LexionToolbarItemState = "enabled" | "disabled" | "hidden";
export type LexionToolbarIconValue = string & {};

export const lexionToolbarIcons = {
  paragraph: "ri-paragraph",
  heading: "ri-heading",
  heading1: "ri-h-1",
  heading2: "ri-h-2",
  heading3: "ri-h-3",
  text: "ri-text",
  textFormat: "ri-font-size",
  bold: "ri-bold",
  italic: "ri-italic",
  code: "ri-code-line",
  strike: "ri-strikethrough",
  underline: "ri-underline",
  quote: "ri-double-quotes-l",
  codeBlock: "ri-code-box-line",
  bulletList: "ri-list-unordered",
  orderedList: "ri-list-ordered",
  outdent: "ri-indent-decrease",
  indent: "ri-indent-increase",
  link: "ri-link",
  unlink: "ri-link-unlink",
  horizontalRule: "ri-separator",
  hardBreak: "ri-corner-down-left-line",
  save: "ri-save-line",
  check: "ri-check-line",
  undo: "ri-arrow-go-back-line",
  redo: "ri-arrow-go-forward-line"
} as const;

export type LexionToolbarIconKey = keyof typeof lexionToolbarIcons;
export type LexionToolbarIconClass =
  (typeof lexionToolbarIcons)[LexionToolbarIconKey];

export type LexionToolbarEditor = Pick<LexionEditor, "execute"> & {
  readonly focus?: () => void;
};

export interface LexionToolbarExecuteEvent {
  readonly item: LexionToolbarItem;
  readonly executed: boolean;
  readonly editor: LexionToolbarEditor | null;
  readonly groupId?: string;
}

export interface LexionToolbarActionContext {
  readonly toolbar: LexionToolbar;
  readonly item: LexionToolbarItem;
  readonly editor: LexionToolbarEditor | null;
  readonly groupId?: string;
}

export type LexionToolbarItemAction = (
  context: LexionToolbarActionContext,
  event: MouseEvent
) => boolean | void;

export interface LexionToolbarItemInput {
  readonly id: string;
  readonly iconClass?: LexionToolbarIconClass | LexionToolbarIconValue;
  readonly label?: string;
  readonly title?: string;
  readonly command?: string;
  readonly args?: readonly unknown[];
  readonly state?: LexionToolbarItemState;
  readonly onClick?: LexionToolbarItemAction;
  readonly items?: readonly LexionToolbarDropdownOptionInput[];
  readonly separator?: boolean;
}

export interface LexionToolbarDropdownOptionInput {
  readonly id: string;
  readonly iconClass: LexionToolbarIconClass | LexionToolbarIconValue;
  readonly label: string;
  readonly title?: string;
  readonly command?: string;
  readonly args?: readonly unknown[];
  readonly state?: LexionToolbarItemState;
  readonly onClick?: LexionToolbarItemAction;
}

export interface LexionToolbarItem {
  readonly id: string;
  readonly iconClass?: LexionToolbarIconClass | LexionToolbarIconValue;
  readonly label?: string;
  readonly title?: string;
  readonly command?: string;
  readonly args?: readonly unknown[];
  readonly state: LexionToolbarItemState;
  readonly onClick?: LexionToolbarItemAction;
  readonly items?: readonly LexionToolbarDropdownOption[];
  readonly separator?: boolean;
}

export interface LexionToolbarDropdownOption {
  readonly id: string;
  readonly iconClass: LexionToolbarIconClass | LexionToolbarIconValue;
  readonly label: string;
  readonly title?: string;
  readonly command?: string;
  readonly args?: readonly unknown[];
  readonly state: LexionToolbarItemState;
  readonly onClick?: LexionToolbarItemAction;
}

type ToolbarItemRecord = {
  -readonly [Key in keyof LexionToolbarItem]: LexionToolbarItem[Key];
};

export interface LexionToolbarItemUpdate {
  readonly separator?: boolean;
  readonly iconClass?: LexionToolbarIconClass | LexionToolbarIconValue;
  readonly label?: string | null;
  readonly title?: string | null;
  readonly command?: string | null;
  readonly args?: readonly unknown[] | null;
  readonly state?: LexionToolbarItemState;
  readonly onClick?: LexionToolbarItemAction | null;
  readonly items?: readonly LexionToolbarDropdownOptionInput[] | null;
}

export interface LexionToolbarOptions {
  readonly element: HTMLElement;
  readonly editor?: LexionToolbarEditor;
  readonly items?: readonly LexionToolbarItemInput[];
  readonly className?: string;
  readonly onItemExecute?: (event: LexionToolbarExecuteEvent) => void;
}

export interface LexionToolbarStyleInjectionOptions {
  readonly document?: Document;
  readonly id?: string;
  readonly target?: HTMLElement;
}

export interface LexionStarterKitToolbarPresetOptions {
  readonly state?: LexionToolbarItemState;
  readonly withLabels?: boolean;
  readonly linkAttributes?: Readonly<Record<string, unknown>>;
}

export const lexionToolbarAppearance = {
  className: "lexion-toolbar-ui",
  buttonClassName: "lexion-toolbar-ui__button",
  buttonEnabledClassName: "lexion-toolbar-ui__button--enabled",
  buttonDisabledClassName: "lexion-toolbar-ui__button--disabled",
  buttonHiddenClassName: "lexion-toolbar-ui__button--hidden",
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

const STATE_CLASS_NAMES: Readonly<Record<LexionToolbarItemState, string>> = {
  enabled: lexionToolbarAppearance.buttonEnabledClassName,
  disabled: lexionToolbarAppearance.buttonDisabledClassName,
  hidden: lexionToolbarAppearance.buttonHiddenClassName
};

const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const clearElement = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const getDefaultDocument = (): Document => {
  if (typeof document !== "undefined") {
    return document;
  }

  throw new Error(
    "A DOM Document is required. Pass { document } when running outside the browser."
  );
};

const normalizeState = (
  state: LexionToolbarItemState | undefined
): LexionToolbarItemState => state ?? "enabled";

const sanitizeId = (id: string): string => {
  const normalized = id.trim();
  if (normalized.length === 0) {
    throw new Error("Toolbar item id is required.");
  }
  return normalized;
};

const sanitizeIconClass = (iconClass: string): string => {
  const normalized = iconClass.trim();
  if (normalized.length === 0) {
    throw new Error("Toolbar item iconClass is required.");
  }
  return normalized;
};

const assertUniqueNestedIds = (
  groupId: string,
  items: readonly { readonly id: string }[]
): void => {
  const seen = new Set<string>();
  for (const item of items) {
    const id = sanitizeId(item.id);
    if (seen.has(id)) {
      throw new Error(`Duplicate dropdown item id in "${groupId}": ${id}`);
    }
    seen.add(id);
  }
};

const createDropdownOptionFromInput = (
  option: LexionToolbarDropdownOptionInput
): LexionToolbarDropdownOption => ({
  id: sanitizeId(option.id),
  iconClass: sanitizeIconClass(option.iconClass),
  label: option.label,
  ...(option.title !== undefined ? { title: option.title } : {}),
  ...(option.command !== undefined ? { command: option.command } : {}),
  ...(option.args !== undefined ? { args: [...option.args] } : {}),
  ...(option.onClick !== undefined ? { onClick: option.onClick } : {}),
  state: normalizeState(option.state)
});

const createItemFromInput = (item: LexionToolbarItemInput): ToolbarItemRecord => {
  const id = sanitizeId(item.id);
  const isSeparator = item.separator === true;
  if (isSeparator) {
    return {
      id,
      separator: true,
      ...(item.label !== undefined ? { label: item.label } : {}),
      ...(item.title !== undefined ? { title: item.title } : {}),
      state: normalizeState(item.state)
    };
  }

  if (item.iconClass === undefined) {
    throw new Error(`Toolbar item iconClass is required: ${id}`);
  }

  return {
    id,
    iconClass: sanitizeIconClass(item.iconClass),
    ...(item.label !== undefined ? { label: item.label } : {}),
    ...(item.title !== undefined ? { title: item.title } : {}),
    ...(item.command !== undefined ? { command: item.command } : {}),
    ...(item.args !== undefined ? { args: [...item.args] } : {}),
    ...(item.onClick !== undefined ? { onClick: item.onClick } : {}),
    ...(item.items !== undefined
      ? {
          items: (() => {
            assertUniqueNestedIds(item.id, item.items);
            return item.items.map((option) => createDropdownOptionFromInput(option));
          })()
        }
      : {}),
    state: normalizeState(item.state)
  };
};

const cloneItem = (item: ToolbarItemRecord | LexionToolbarItem): LexionToolbarItem => ({
  id: item.id,
  ...(item.separator === true ? { separator: true } : {}),
  ...(item.iconClass !== undefined ? { iconClass: item.iconClass } : {}),
  ...(item.label !== undefined ? { label: item.label } : {}),
  ...(item.title !== undefined ? { title: item.title } : {}),
  ...(item.command !== undefined ? { command: item.command } : {}),
  ...(item.args !== undefined ? { args: [...item.args] } : {}),
  ...(item.onClick !== undefined ? { onClick: item.onClick } : {}),
  ...(item.items !== undefined
    ? {
        items: item.items.map((option) => ({
          id: option.id,
          iconClass: option.iconClass,
          label: option.label,
          ...(option.title !== undefined ? { title: option.title } : {}),
          ...(option.command !== undefined ? { command: option.command } : {}),
          ...(option.args !== undefined ? { args: [...option.args] } : {}),
          ...(option.onClick !== undefined ? { onClick: option.onClick } : {}),
          state: option.state
        }))
      }
    : {}),
  state: item.state
});

const assertUniqueIds = (items: readonly ToolbarItemRecord[]): void => {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate toolbar item id: ${item.id}`);
    }
    seen.add(item.id);
  }
};

const applyButtonState = (button: HTMLButtonElement, state: LexionToolbarItemState): void => {
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

const createButtonElement = (
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

  applyButtonState(button, item.state);
  return button;
};

const createSeparatorElement = (
  documentNode: Document,
  item: ToolbarItemRecord
): HTMLDivElement => {
  const separator = documentNode.createElement("div");
  separator.className = lexionToolbarAppearance.separatorClassName;
  separator.setAttribute(lexionToolbarAppearance.itemIdAttribute, item.id);
  separator.setAttribute(lexionToolbarAppearance.stateAttribute, item.state);
  separator.setAttribute("role", "separator");
  if (item.state === "hidden") {
    separator.hidden = true;
  }
  return separator;
};

const applyDropdownOptionState = (
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

const createDropdownOptionButton = (
  documentNode: Document,
  parentId: string,
  option: LexionToolbarDropdownOption
): HTMLButtonElement => {
  const button = documentNode.createElement("button");
  button.type = "button";
  button.className = lexionToolbarAppearance.dropdownItemClassName;
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

const createDropdownElement = (
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
  for (const option of item.items ?? []) {
    menu.appendChild(createDropdownOptionButton(documentNode, item.id, option));
  }
  wrapper.appendChild(menu);

  if (item.state === "hidden") {
    wrapper.hidden = true;
  }

  return wrapper;
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

export class LexionToolbar {
  private readonly hostElement: HTMLElement;
  private readonly toolbarElement: HTMLDivElement;
  private editorInstance: LexionToolbarEditor | null;
  private items: ToolbarItemRecord[];
  private onItemExecute: ((event: LexionToolbarExecuteEvent) => void) | undefined;
  private openDropdownId: string | null;
  private destroyed: boolean;

  public constructor(options: LexionToolbarOptions) {
    this.hostElement = options.element;
    this.editorInstance = options.editor ?? null;
    this.items = [];
    this.onItemExecute = options.onItemExecute;
    this.openDropdownId = null;
    this.destroyed = false;

    this.toolbarElement = this.hostElement.ownerDocument.createElement("div");
    this.toolbarElement.className = options.className
      ? `${lexionToolbarAppearance.className} ${options.className}`
      : lexionToolbarAppearance.className;
    this.toolbarElement.addEventListener("pointerdown", this.handlePointerDown, true);
    this.toolbarElement.addEventListener("mousedown", this.handleMouseDown, true);
    this.toolbarElement.addEventListener("click", this.handleClick);
    this.hostElement.ownerDocument.addEventListener("click", this.handleDocumentClick);
    this.hostElement.ownerDocument.addEventListener("keydown", this.handleDocumentKeydown);
    this.hostElement.appendChild(this.toolbarElement);

    this.setItems(options.items ?? []);
  }

  public get element(): HTMLDivElement {
    return this.toolbarElement;
  }

  public setEditor(editor: LexionToolbarEditor | null): void {
    this.assertNotDestroyed();
    this.editorInstance = editor;
  }

  public getItems(): readonly LexionToolbarItem[] {
    this.assertNotDestroyed();
    return this.items.map((item) => cloneItem(item));
  }

  public setItems(items: readonly LexionToolbarItemInput[]): void {
    this.assertNotDestroyed();
    const nextItems = items.map((item) => createItemFromInput(item));
    assertUniqueIds(nextItems);
    this.items = nextItems;
    this.renderItems();
  }

  public addItem(item: LexionToolbarItemInput, index = this.items.length): void {
    this.assertNotDestroyed();
    const nextItem = createItemFromInput(item);
    if (this.items.some((existingItem) => existingItem.id === nextItem.id)) {
      throw new Error(`Toolbar item already exists: ${nextItem.id}`);
    }

    const safeIndex = Math.max(0, Math.min(index, this.items.length));
    this.items = [
      ...this.items.slice(0, safeIndex),
      nextItem,
      ...this.items.slice(safeIndex)
    ];
    this.renderItems();
  }

  public updateItem(id: string, update: LexionToolbarItemUpdate): void {
    this.assertNotDestroyed();
    const itemIndex = this.findItemIndex(id);
    const current = this.items[itemIndex];
    if (!current) {
      throw new Error(`Toolbar item not found: ${id}`);
    }

    const nextItem: ToolbarItemRecord = {
      ...current
    };

    if (hasOwn(update, "separator")) {
      if (update.separator === true) {
        nextItem.separator = true;
        delete nextItem.iconClass;
        delete nextItem.command;
        delete nextItem.args;
        delete nextItem.onClick;
        delete nextItem.items;
      } else if (update.separator === false) {
        delete nextItem.separator;
      }
    }

    if (hasOwn(update, "iconClass")) {
      if (update.iconClass === undefined) {
        throw new Error("Toolbar item iconClass cannot be undefined.");
      }
      nextItem.iconClass = sanitizeIconClass(update.iconClass);
    }

    if (hasOwn(update, "label")) {
      if (update.label === null) {
        delete nextItem.label;
      } else if (update.label !== undefined) {
        nextItem.label = update.label;
      }
    }

    if (hasOwn(update, "title")) {
      if (update.title === null) {
        delete nextItem.title;
      } else if (update.title !== undefined) {
        nextItem.title = update.title;
      }
    }

    if (hasOwn(update, "command")) {
      if (update.command === null) {
        delete nextItem.command;
      } else if (update.command !== undefined) {
        nextItem.command = update.command;
      }
    }

    if (hasOwn(update, "args")) {
      if (update.args === null) {
        delete nextItem.args;
      } else if (update.args !== undefined) {
        nextItem.args = [...update.args];
      }
    }

    if (hasOwn(update, "onClick")) {
      if (update.onClick === null) {
        delete nextItem.onClick;
      } else if (update.onClick !== undefined) {
        nextItem.onClick = update.onClick;
      }
    }

    if (hasOwn(update, "items")) {
      if (update.items === null) {
        delete nextItem.items;
      } else if (update.items !== undefined) {
        if (nextItem.separator === true) {
          throw new Error("Separator items cannot contain dropdown items.");
        }
        assertUniqueNestedIds(nextItem.id, update.items);
        nextItem.items = update.items.map((option) => createDropdownOptionFromInput(option));
      }
    }

    if (hasOwn(update, "state")) {
      nextItem.state = normalizeState(update.state);
    }

    if (nextItem.separator !== true && nextItem.iconClass === undefined) {
      throw new Error(`Toolbar item "${id}" requires an iconClass when not a separator.`);
    }

    this.items = [
      ...this.items.slice(0, itemIndex),
      nextItem,
      ...this.items.slice(itemIndex + 1)
    ];
    this.renderItems();
  }

  public removeItem(id: string): void {
    this.assertNotDestroyed();
    const itemIndex = this.findItemIndex(id);
    if (itemIndex < 0) {
      throw new Error(`Toolbar item not found: ${id}`);
    }

    this.items = [...this.items.slice(0, itemIndex), ...this.items.slice(itemIndex + 1)];
    this.renderItems();
  }

  public clearItems(): void {
    this.assertNotDestroyed();
    this.items = [];
    this.renderItems();
  }

  public setItemState(id: string, state: LexionToolbarItemState): void {
    this.assertNotDestroyed();
    this.updateItem(id, { state });
  }

  public setItemStates(states: Readonly<Record<string, LexionToolbarItemState>>): void {
    this.assertNotDestroyed();
    const entries = Object.entries(states);
    if (entries.length === 0) {
      return;
    }

    const nextItems = this.items.map((item) => ({ ...item }));
    for (const [id, state] of entries) {
      const index = nextItems.findIndex((item) => item.id === id);
      if (index < 0) {
        throw new Error(`Toolbar item not found: ${id}`);
      }
      const current = nextItems[index];
      if (!current) {
        throw new Error(`Toolbar item not found: ${id}`);
      }
      nextItems[index] = {
        ...current,
        state: normalizeState(state)
      };
    }

    this.items = nextItems;
    this.renderItems();
  }

  public enableItem(id: string): void {
    this.setItemState(id, "enabled");
  }

  public disableItem(id: string): void {
    this.setItemState(id, "disabled");
  }

  public hideItem(id: string): void {
    this.setItemState(id, "hidden");
  }

  public showItem(
    id: string,
    state: Exclude<LexionToolbarItemState, "hidden"> = "enabled"
  ): void {
    this.setItemState(id, state);
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.toolbarElement.removeEventListener("pointerdown", this.handlePointerDown, true);
    this.toolbarElement.removeEventListener("mousedown", this.handleMouseDown, true);
    this.toolbarElement.removeEventListener("click", this.handleClick);
    this.hostElement.ownerDocument.removeEventListener("click", this.handleDocumentClick);
    this.hostElement.ownerDocument.removeEventListener("keydown", this.handleDocumentKeydown);
    this.closeDropdownMenus();
    this.toolbarElement.remove();
    this.items = [];
    this.editorInstance = null;
    this.openDropdownId = null;
    this.onItemExecute = undefined;
    this.destroyed = true;
  }

  private findItemIndex(id: string): number {
    return this.items.findIndex((item) => item.id === id);
  }

  private renderItems(): void {
    clearElement(this.toolbarElement);
    const documentNode = this.toolbarElement.ownerDocument;
    for (const item of this.items) {
      if (item.separator === true) {
        this.toolbarElement.appendChild(createSeparatorElement(documentNode, item));
      } else if (item.items !== undefined) {
        this.toolbarElement.appendChild(createDropdownElement(documentNode, item));
      } else {
        this.toolbarElement.appendChild(createButtonElement(documentNode, item));
      }
    }
    this.closeDropdownMenus();
  }

  private executeItem(
    item: LexionToolbarItem,
    event: MouseEvent,
    groupId?: string
  ): void {
    // Best effort: if the adapter exposes focus(), restore editor focus before command evaluation.
    this.editorInstance?.focus?.();

    const actionContext: LexionToolbarActionContext = {
      toolbar: this,
      item: cloneItem(item),
      editor: this.editorInstance,
      ...(groupId !== undefined ? { groupId } : {})
    };

    const onClickResult = item.onClick?.(actionContext, event);
    if (onClickResult === false) {
      this.onItemExecute?.({
        item: cloneItem(item),
        executed: false,
        editor: this.editorInstance,
        ...(groupId !== undefined ? { groupId } : {})
      });
      return;
    }

    let executed = false;
    if (item.command !== undefined) {
      executed =
        this.editorInstance?.execute(item.command, ...(item.args ?? [])) ?? false;
    }

    this.onItemExecute?.({
      item: cloneItem(item),
      executed,
      editor: this.editorInstance,
      ...(groupId !== undefined ? { groupId } : {})
    });
  }

  private findItemById(id: string): ToolbarItemRecord | undefined {
    return this.items.find((entry) => entry.id === id);
  }

  private closeDropdownMenus(exceptId?: string): void {
    const wrappers = this.toolbarElement.querySelectorAll<HTMLDivElement>(
      `.${lexionToolbarAppearance.dropdownClassName}`
    );
    wrappers.forEach((wrapper) => {
      const itemId = wrapper.getAttribute(lexionToolbarAppearance.itemIdAttribute);
      const shouldOpen = exceptId !== undefined && itemId === exceptId;
      wrapper.classList.toggle(lexionToolbarAppearance.dropdownOpenClassName, shouldOpen);
      const trigger = wrapper.querySelector(
        `button[${lexionToolbarAppearance.itemIdAttribute}]`
      ) as HTMLButtonElement | null;
      if (trigger) {
        trigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      }
    });
    this.openDropdownId = exceptId ?? null;
  }

  private toggleDropdown(itemId: string): void {
    if (this.openDropdownId === itemId) {
      this.closeDropdownMenus();
      return;
    }
    this.closeDropdownMenus(itemId);
  }

  private readonly handleClick = (event: MouseEvent): void => {
    this.assertNotDestroyed();
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const optionSelector = `button[${lexionToolbarAppearance.dropdownOptionIdAttribute}]`;
    const optionButton = target.closest<HTMLButtonElement>(optionSelector);
    if (optionButton && this.toolbarElement.contains(optionButton)) {
      const parentId = optionButton.getAttribute(
        lexionToolbarAppearance.dropdownParentIdAttribute
      );
      const optionId = optionButton.getAttribute(
        lexionToolbarAppearance.dropdownOptionIdAttribute
      );
      if (!parentId || !optionId) {
        return;
      }
      const parentItem = this.findItemById(parentId);
      if (!parentItem || parentItem.state !== "enabled" || parentItem.items === undefined) {
        return;
      }
      const option = parentItem.items.find((entry) => entry.id === optionId);
      if (!option || option.state !== "enabled") {
        return;
      }
      const optionItem: LexionToolbarItem = {
        id: option.id,
        iconClass: option.iconClass,
        label: option.label,
        ...(option.title !== undefined ? { title: option.title } : {}),
        ...(option.command !== undefined ? { command: option.command } : {}),
        ...(option.args !== undefined ? { args: [...option.args] } : {}),
        ...(option.onClick !== undefined ? { onClick: option.onClick } : {}),
        state: option.state
      };
      this.executeItem(optionItem, event, parentId);
      this.closeDropdownMenus();
      return;
    }

    const selector = `button[${lexionToolbarAppearance.itemIdAttribute}]`;
    const button = target.closest<HTMLButtonElement>(selector);
    if (!button || !this.toolbarElement.contains(button)) {
      return;
    }

    const itemId = button.getAttribute(lexionToolbarAppearance.itemIdAttribute);
    if (!itemId) {
      return;
    }

    const item = this.findItemById(itemId);
    if (!item || item.state !== "enabled") {
      return;
    }

    if (item.items !== undefined) {
      this.toggleDropdown(item.id);
      return;
    }

    this.closeDropdownMenus();
    this.executeItem(item, event);
  };

  private preventToolbarButtonFocus(event: MouseEvent | PointerEvent): void {
    if (this.destroyed || event.button !== 0) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (!this.toolbarElement.contains(target)) {
      return;
    }

    const interactiveButton = target.closest<HTMLButtonElement>("button");
    if (!interactiveButton || interactiveButton.disabled) {
      return;
    }

    // Keep editor focus/selection while toolbar commands execute.
    event.preventDefault();
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    this.preventToolbarButtonFocus(event);
  };

  private readonly handleMouseDown = (event: MouseEvent): void => {
    this.preventToolbarButtonFocus(event);
  };

  private readonly handleDocumentClick = (event: MouseEvent): void => {
    if (this.destroyed) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }
    if (this.toolbarElement.contains(target)) {
      return;
    }
    this.closeDropdownMenus();
  };

  private readonly handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (this.destroyed) {
      return;
    }
    if (event.key === "Escape") {
      this.closeDropdownMenus();
    }
  };

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error("LexionToolbar has been destroyed.");
    }
  }
}

export const createToolbarSeparatorItem = (
  id: string,
  state: LexionToolbarItemState = "enabled"
): LexionToolbarItemInput => ({
  id,
  separator: true,
  state
});

const defaultStarterKitLinkAttributes = {
  href: "https://lexion.app",
  title: "Lexion"
} as const;

const withStarterKitLabel = (
  label: string,
  withLabels: boolean | undefined
): Pick<LexionToolbarItemInput, "label" | "title"> => ({
  ...(withLabels === false ? {} : { label }),
  title: label
});

export const createStarterKitToolbarItems = (
  options: LexionStarterKitToolbarPresetOptions = {}
): readonly LexionToolbarItemInput[] => {
  const state = options.state ?? "enabled";
  const withLabels = options.withLabels ?? true;
  const linkAttributes = options.linkAttributes ?? defaultStarterKitLinkAttributes;

  return [
    {
      id: "paragraph",
      iconClass: lexionToolbarIcons.paragraph,
      command: starterKitCommandNames.setParagraph,
      state,
      ...withStarterKitLabel("Paragraph", withLabels)
    },
    {
      id: "heading-1",
      iconClass: lexionToolbarIcons.heading1,
      command: starterKitCommandNames.toggleHeading,
      args: [1],
      state,
      ...withStarterKitLabel("H1", withLabels)
    },
    {
      id: "heading-2",
      iconClass: lexionToolbarIcons.heading2,
      command: starterKitCommandNames.toggleHeading,
      args: [2],
      state,
      ...withStarterKitLabel("H2", withLabels)
    },
    {
      id: "heading-3",
      iconClass: lexionToolbarIcons.heading3,
      command: starterKitCommandNames.toggleHeading,
      args: [3],
      state,
      ...withStarterKitLabel("H3", withLabels)
    },
    {
      id: "bold",
      iconClass: lexionToolbarIcons.bold,
      command: starterKitCommandNames.toggleBold,
      state,
      ...withStarterKitLabel("Bold", withLabels)
    },
    {
      id: "italic",
      iconClass: lexionToolbarIcons.italic,
      command: starterKitCommandNames.toggleItalic,
      state,
      ...withStarterKitLabel("Italic", withLabels)
    },
    {
      id: "code",
      iconClass: lexionToolbarIcons.code,
      command: starterKitCommandNames.toggleCode,
      state,
      ...withStarterKitLabel("Code", withLabels)
    },
    {
      id: "strike",
      iconClass: lexionToolbarIcons.strike,
      command: starterKitCommandNames.toggleStrike,
      state,
      ...withStarterKitLabel("Strike", withLabels)
    },
    {
      id: "underline",
      iconClass: lexionToolbarIcons.underline,
      command: starterKitCommandNames.toggleUnderline,
      state,
      ...withStarterKitLabel("Underline", withLabels)
    },
    {
      id: "blockquote",
      iconClass: lexionToolbarIcons.quote,
      command: starterKitCommandNames.toggleBlockquote,
      state,
      ...withStarterKitLabel("Quote", withLabels)
    },
    {
      id: "code-block",
      iconClass: lexionToolbarIcons.codeBlock,
      command: starterKitCommandNames.toggleCodeBlock,
      state,
      ...withStarterKitLabel("Code Block", withLabels)
    },
    {
      id: "bullet-list",
      iconClass: lexionToolbarIcons.bulletList,
      command: starterKitCommandNames.wrapBulletList,
      state,
      ...withStarterKitLabel("Bullet List", withLabels)
    },
    {
      id: "ordered-list",
      iconClass: lexionToolbarIcons.orderedList,
      command: starterKitCommandNames.wrapOrderedList,
      state,
      ...withStarterKitLabel("Ordered List", withLabels)
    },
    {
      id: "outdent",
      iconClass: lexionToolbarIcons.outdent,
      command: starterKitCommandNames.liftListItem,
      state,
      ...withStarterKitLabel("Outdent", withLabels)
    },
    {
      id: "indent",
      iconClass: lexionToolbarIcons.indent,
      command: starterKitCommandNames.sinkListItem,
      state,
      ...withStarterKitLabel("Indent", withLabels)
    },
    {
      id: "set-link",
      iconClass: lexionToolbarIcons.link,
      command: starterKitCommandNames.setLink,
      args: [linkAttributes],
      state,
      ...withStarterKitLabel("Set Link", withLabels)
    },
    {
      id: "unset-link",
      iconClass: lexionToolbarIcons.unlink,
      command: starterKitCommandNames.unsetLink,
      state,
      ...withStarterKitLabel("Unset Link", withLabels)
    },
    {
      id: "horizontal-rule",
      iconClass: lexionToolbarIcons.horizontalRule,
      command: starterKitCommandNames.insertHorizontalRule,
      state,
      ...withStarterKitLabel("Rule", withLabels)
    },
    {
      id: "hard-break",
      iconClass: lexionToolbarIcons.hardBreak,
      command: starterKitCommandNames.insertHardBreak,
      state,
      ...withStarterKitLabel("Break", withLabels)
    },
    {
      id: "undo",
      iconClass: lexionToolbarIcons.undo,
      command: starterKitCommandNames.undo,
      state,
      ...withStarterKitLabel("Undo", withLabels)
    },
    {
      id: "redo",
      iconClass: lexionToolbarIcons.redo,
      command: starterKitCommandNames.redo,
      state,
      ...withStarterKitLabel("Redo", withLabels)
    }
  ];
};

export const createLexionToolbar = (options: LexionToolbarOptions): LexionToolbar =>
  new LexionToolbar(options);
