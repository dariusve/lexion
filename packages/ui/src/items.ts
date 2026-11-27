import type {
  LexionToolbarDropdownOption,
  LexionToolbarDropdownOptionInput,
  LexionToolbarItem,
  LexionToolbarItemInput,
  LexionToolbarItemState,
  ToolbarItemRecord
} from "./types.js";

export const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

export const normalizeState = (state: LexionToolbarItemState | undefined): LexionToolbarItemState =>
  state ?? "enabled";

export const sanitizeId = (id: string): string => {
  const normalized = id.trim();
  if (normalized.length === 0) {
    throw new Error("Toolbar item id is required.");
  }
  return normalized;
};

export const sanitizeIconClass = (iconClass: string): string => {
  const normalized = iconClass.trim();
  if (normalized.length === 0) {
    throw new Error("Toolbar item iconClass is required.");
  }
  return normalized;
};

export const assertUniqueNestedIds = (
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

export const createDropdownOptionFromInput = (
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

export const createItemFromInput = (item: LexionToolbarItemInput): ToolbarItemRecord => {
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
    ...(item.active !== undefined ? { active: item.active } : {}),
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

export const cloneItem = (item: ToolbarItemRecord | LexionToolbarItem): LexionToolbarItem => ({
  id: item.id,
  ...(item.separator === true ? { separator: true } : {}),
  ...(item.iconClass !== undefined ? { iconClass: item.iconClass } : {}),
  ...(item.label !== undefined ? { label: item.label } : {}),
  ...(item.title !== undefined ? { title: item.title } : {}),
  ...(item.command !== undefined ? { command: item.command } : {}),
  ...(item.args !== undefined ? { args: [...item.args] } : {}),
  ...(item.onClick !== undefined ? { onClick: item.onClick } : {}),
  ...(item.active !== undefined ? { active: item.active } : {}),
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

export const assertUniqueIds = (items: readonly ToolbarItemRecord[]): void => {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate toolbar item id: ${item.id}`);
    }
    seen.add(item.id);
  }
};
