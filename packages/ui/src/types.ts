import type { LexionEditor } from "@lexion-rte/core";

import type { lexionToolbarIcons } from "./icons.js";
import type { LexionToolbar } from "./toolbar.js";

export type LexionToolbarItemState = "enabled" | "disabled" | "hidden";
export type LexionToolbarIconValue = string & {};

export type LexionToolbarIconKey = keyof typeof lexionToolbarIcons;
export type LexionToolbarIconClass = (typeof lexionToolbarIcons)[LexionToolbarIconKey];

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
  /**
   * Toggle state for buttons such as bold or a list type. When set, the button gets
   * `aria-pressed` and the active class. Leave undefined for plain action buttons.
   */
  readonly active?: boolean;
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
  readonly active?: boolean;
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

export type ToolbarItemRecord = {
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
  /** `null` removes the toggle state (the button stops exposing `aria-pressed`). */
  readonly active?: boolean | null;
}

export interface LexionToolbarOptions {
  readonly element: HTMLElement;
  readonly editor?: LexionToolbarEditor;
  readonly items?: readonly LexionToolbarItemInput[];
  readonly className?: string;
  /** Accessible name of the toolbar (default "Editor toolbar"). */
  readonly ariaLabel?: string;
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
