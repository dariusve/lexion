import { lexionToolbarAppearance } from "./appearance.js";
import {
  clearElement,
  createButtonElement,
  createDropdownElement,
  createSeparatorElement
} from "./dom.js";
import {
  assertUniqueIds,
  assertUniqueNestedIds,
  cloneItem,
  createDropdownOptionFromInput,
  createItemFromInput,
  hasOwn,
  normalizeState,
  sanitizeIconClass
} from "./items.js";
import type {
  LexionToolbarActionContext,
  LexionToolbarEditor,
  LexionToolbarExecuteEvent,
  LexionToolbarItem,
  LexionToolbarItemInput,
  LexionToolbarItemState,
  LexionToolbarItemUpdate,
  LexionToolbarOptions,
  ToolbarItemRecord
} from "./types.js";

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
    this.toolbarElement.setAttribute("role", "toolbar");
    this.toolbarElement.setAttribute("aria-orientation", "horizontal");
    this.toolbarElement.setAttribute("aria-label", options.ariaLabel ?? "Editor toolbar");
    this.toolbarElement.addEventListener("keydown", this.handleToolbarKeydown);
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
    this.items = [...this.items.slice(0, safeIndex), nextItem, ...this.items.slice(safeIndex)];
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

    if (hasOwn(update, "active")) {
      if (update.active === null) {
        delete nextItem.active;
      } else if (update.active !== undefined) {
        nextItem.active = update.active;
      }
    }

    if (nextItem.separator !== true && nextItem.iconClass === undefined) {
      throw new Error(`Toolbar item "${id}" requires an iconClass when not a separator.`);
    }

    this.items = [...this.items.slice(0, itemIndex), nextItem, ...this.items.slice(itemIndex + 1)];
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

  /** Sets the toggle state (`aria-pressed`) of a button, e.g. from the editor selection. */
  public setItemActive(id: string, active: boolean): void {
    this.assertNotDestroyed();
    this.updateItem(id, { active });
  }

  /** Sets several toggle states with a single re-render. */
  public setItemsActive(states: Readonly<Record<string, boolean>>): void {
    this.assertNotDestroyed();
    const entries = Object.entries(states);
    if (entries.length === 0) {
      return;
    }
    const nextItems = this.items.map((item) => ({ ...item }));
    for (const [id, active] of entries) {
      const item = nextItems.find((entry) => entry.id === id);
      if (!item) {
        throw new Error(`Toolbar item not found: ${id}`);
      }
      item.active = active;
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

  public showItem(id: string, state: Exclude<LexionToolbarItemState, "hidden"> = "enabled"): void {
    this.setItemState(id, state);
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.toolbarElement.removeEventListener("pointerdown", this.handlePointerDown, true);
    this.toolbarElement.removeEventListener("mousedown", this.handleMouseDown, true);
    this.toolbarElement.removeEventListener("click", this.handleClick);
    this.toolbarElement.removeEventListener("keydown", this.handleToolbarKeydown);
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
    const focusedId = this.getFocusedItemId();
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
    this.updateRovingTabIndex(focusedId);
    if (focusedId !== null) {
      // Re-rendering replaces the buttons; keep keyboard focus where it was.
      this.getTopLevelButtons()
        .find(
          (button) => button.getAttribute(lexionToolbarAppearance.itemIdAttribute) === focusedId
        )
        ?.focus();
    }
  }

  /** Visible, enabled top-level buttons in DOM order (the toolbar's arrow-key stops). */
  private getTopLevelButtons(): HTMLButtonElement[] {
    return Array.from(
      this.toolbarElement.querySelectorAll<HTMLButtonElement>(
        `button[${lexionToolbarAppearance.itemIdAttribute}]`
      )
    ).filter((button) => !button.disabled && !button.hidden && !button.closest("[hidden]"));
  }

  private getFocusedItemId(): string | null {
    const active = this.toolbarElement.ownerDocument.activeElement;
    if (!(active instanceof HTMLElement) || !this.toolbarElement.contains(active)) {
      return null;
    }
    return (
      active
        .closest(`[${lexionToolbarAppearance.itemIdAttribute}]`)
        ?.getAttribute(lexionToolbarAppearance.itemIdAttribute) ?? null
    );
  }

  /** Only one toolbar button is in the Tab order; arrow keys move between them. */
  private updateRovingTabIndex(preferredId: string | null): void {
    const buttons = this.getTopLevelButtons();
    const current =
      buttons.find(
        (button) => button.getAttribute(lexionToolbarAppearance.itemIdAttribute) === preferredId
      ) ??
      buttons.find((button) => button.tabIndex === 0) ??
      buttons[0];
    this.toolbarElement
      .querySelectorAll<HTMLButtonElement>(`button[${lexionToolbarAppearance.itemIdAttribute}]`)
      .forEach((button) => {
        button.tabIndex = button === current ? 0 : -1;
      });
  }

  private focusTopLevelButton(button: HTMLButtonElement | undefined): void {
    if (!button) {
      return;
    }
    this.updateRovingTabIndex(button.getAttribute(lexionToolbarAppearance.itemIdAttribute));
    button.focus();
  }

  private getMenuItems(itemId: string): HTMLButtonElement[] {
    return Array.from(
      this.toolbarElement.querySelectorAll<HTMLButtonElement>(
        `button[${lexionToolbarAppearance.dropdownParentIdAttribute}]`
      )
    ).filter(
      (button) =>
        button.getAttribute(lexionToolbarAppearance.dropdownParentIdAttribute) === itemId &&
        !button.disabled &&
        !button.hidden
    );
  }

  private readonly handleToolbarKeydown = (event: KeyboardEvent): void => {
    if (this.destroyed) {
      return;
    }
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const parentId = target.getAttribute(lexionToolbarAppearance.dropdownParentIdAttribute);
    if (parentId !== null) {
      this.handleMenuKeydown(event, target, parentId);
      return;
    }

    const itemId = target.getAttribute(lexionToolbarAppearance.itemIdAttribute);
    if (itemId === null) {
      return;
    }
    const buttons = this.getTopLevelButtons();
    const index = buttons.indexOf(target);
    const item = this.findItemById(itemId);

    switch (event.key) {
      case "ArrowRight":
        this.focusTopLevelButton(buttons[(index + 1) % buttons.length]);
        break;
      case "ArrowLeft":
        this.focusTopLevelButton(buttons[(index - 1 + buttons.length) % buttons.length]);
        break;
      case "Home":
        this.focusTopLevelButton(buttons[0]);
        break;
      case "End":
        this.focusTopLevelButton(buttons[buttons.length - 1]);
        break;
      case "ArrowDown":
        if (item?.items === undefined || item.state !== "enabled") {
          return;
        }
        this.closeDropdownMenus(item.id);
        this.getMenuItems(item.id)[0]?.focus();
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  private handleMenuKeydown(
    event: KeyboardEvent,
    target: HTMLButtonElement,
    parentId: string
  ): void {
    const menuItems = this.getMenuItems(parentId);
    const index = menuItems.indexOf(target);
    const trigger = this.getTopLevelButtons().find(
      (button) => button.getAttribute(lexionToolbarAppearance.itemIdAttribute) === parentId
    );

    switch (event.key) {
      case "ArrowDown":
        menuItems[(index + 1) % menuItems.length]?.focus();
        break;
      case "ArrowUp":
        menuItems[(index - 1 + menuItems.length) % menuItems.length]?.focus();
        break;
      case "Home":
        menuItems[0]?.focus();
        break;
      case "End":
        menuItems[menuItems.length - 1]?.focus();
        break;
      case "Escape":
        this.closeDropdownMenus();
        trigger?.focus();
        break;
      case "Tab":
        // Leave the menu with the normal Tab order, but close it.
        this.closeDropdownMenus();
        return;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  private executeItem(item: LexionToolbarItem, event: MouseEvent, groupId?: string): void {
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
      executed = this.editorInstance?.execute(item.command, ...(item.args ?? [])) ?? false;
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
      const parentId = optionButton.getAttribute(lexionToolbarAppearance.dropdownParentIdAttribute);
      const optionId = optionButton.getAttribute(lexionToolbarAppearance.dropdownOptionIdAttribute);
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
  }

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

export const createLexionToolbar = (options: LexionToolbarOptions): LexionToolbar =>
  new LexionToolbar(options);
