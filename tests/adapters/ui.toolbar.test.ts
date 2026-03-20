import { describe, expect, test, vi } from "vitest";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";

import {
  createStarterKitToolbarItems,
  createToolbarSeparatorItem,
  createLexionToolbar,
  injectLexionToolbarStyles,
  lexionToolbarIcons,
  lexionToolbarAppearance
} from "@lexion-rte/ui";

describe("@lexion-rte/ui", () => {
  test("executes enabled commands and skips disabled/hidden items", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const execute = vi.fn<(...args: readonly unknown[]) => boolean>(() => true);

    injectLexionToolbarStyles();

    const toolbar = createLexionToolbar({
      element: host,
      editor: {
        execute: (command: string, ...args: readonly unknown[]) => execute(command, ...args)
      },
      items: [
        {
          id: "bold",
          iconClass: lexionToolbarIcons.bold,
          label: "Bold",
          command: "toggleBold",
          state: "enabled"
        },
        {
          id: "italic",
          iconClass: lexionToolbarIcons.italic,
          label: "Italic",
          command: "toggleItalic",
          state: "disabled"
        },
        {
          id: "link",
          iconClass: lexionToolbarIcons.link,
          label: "Link",
          command: "setLink",
          args: [{ href: "https://lexion.app" }],
          state: "hidden"
        }
      ]
    });

    const buttonSelector = `[${lexionToolbarAppearance.itemIdAttribute}]`;
    const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>(buttonSelector));
    expect(buttons).toHaveLength(3);

    buttons[0]?.click();
    buttons[1]?.click();
    buttons[2]?.click();

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith("toggleBold");
    expect(buttons[1]?.disabled).toBe(true);
    expect(buttons[2]?.hidden).toBe(true);

    toolbar.destroy();
    host.remove();
  });

  test("supports managing toolbar items and state changes", () => {
    const host = document.createElement("div");
    const toolbar = createLexionToolbar({
      element: host,
      items: [{ id: "paragraph", iconClass: "ri-paragraph", command: "setParagraph" }]
    });

    toolbar.addItem({ id: "code", iconClass: "ri-code-line", command: "toggleCode" });
    toolbar.updateItem("code", {
      label: "Code",
      title: "Toggle inline code",
      state: "disabled"
    });
    toolbar.showItem("code", "enabled");
    toolbar.setItemStates({
      paragraph: "disabled",
      code: "hidden"
    });

    const nextItems = toolbar.getItems();
    expect(nextItems).toHaveLength(2);
    expect(nextItems[0]?.state).toBe("disabled");
    expect(nextItems[1]?.state).toBe("hidden");

    toolbar.removeItem("paragraph");
    expect(toolbar.getItems()).toHaveLength(1);

    toolbar.clearItems();
    expect(toolbar.getItems()).toHaveLength(0);

    toolbar.destroy();
  });

  test("provides starter-kit toolbar presets with remixicon classes", () => {
    const items = createStarterKitToolbarItems({ withLabels: false, state: "disabled" });
    expect(items.length).toBeGreaterThan(10);

    const boldItem = items.find((item) => item.id === "bold");
    expect(boldItem).toBeDefined();
    expect(boldItem?.iconClass).toBe("ri-bold");
    expect(boldItem?.command).toBe(starterKitCommandNames.toggleBold);
    expect(boldItem?.state).toBe("disabled");
    expect(boldItem?.label).toBeUndefined();
    expect(boldItem?.title).toBe("Bold");

    const linkItem = items.find((item) => item.id === "set-link");
    expect(linkItem).toBeDefined();
    expect(linkItem?.args).toEqual([{ href: "https://lexion.app", title: "Lexion" }]);
  });

  test("supports dropdown groups with icon + command name items", () => {
    const host = document.createElement("div");
    const execute = vi.fn<(...args: readonly unknown[]) => boolean>(() => true);
    const onItemExecute = vi.fn();

    const toolbar = createLexionToolbar({
      element: host,
      editor: {
        execute: (command: string, ...args: readonly unknown[]) => execute(command, ...args)
      },
      onItemExecute,
      items: [
        {
          id: "text-style",
          iconClass: lexionToolbarIcons.text,
          title: "Text style",
          items: [
            {
              id: "bold-option",
              iconClass: lexionToolbarIcons.bold,
              label: "Bold",
              command: "toggleBold"
            },
            {
              id: "italic-option",
              iconClass: lexionToolbarIcons.italic,
              label: "Italic",
              command: "toggleItalic"
            }
          ]
        }
      ]
    });

    const trigger = host.querySelector<HTMLButtonElement>(
      `button[${lexionToolbarAppearance.itemIdAttribute}="text-style"]`
    );
    expect(trigger).not.toBeNull();
    trigger?.click();

    const wrapper = host.querySelector(`.${lexionToolbarAppearance.dropdownOpenClassName}`);
    expect(wrapper).not.toBeNull();

    const optionButtons = Array.from(
      host.querySelectorAll<HTMLButtonElement>(
        `button[${lexionToolbarAppearance.dropdownOptionIdAttribute}]`
      )
    );
    expect(optionButtons).toHaveLength(2);
    expect(optionButtons[0]?.textContent ?? "").toContain("Bold");
    expect(
      optionButtons[0]
        ?.querySelector(`.${lexionToolbarAppearance.iconClassName}`)
        ?.className.includes("ri-bold")
    ).toBe(true);

    optionButtons[0]?.click();

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith("toggleBold");
    expect(onItemExecute).toHaveBeenCalledTimes(1);
    expect(onItemExecute.mock.calls[0]?.[0]).toMatchObject({
      groupId: "text-style",
      item: { id: "bold-option" }
    });
    expect(host.querySelector(`.${lexionToolbarAppearance.dropdownOpenClassName}`)).toBeNull();

    toolbar.destroy();
  });

  test("renders non-clickable separators between buttons", () => {
    const host = document.createElement("div");
    const execute = vi.fn<(...args: readonly unknown[]) => boolean>(() => true);

    const toolbar = createLexionToolbar({
      element: host,
      editor: {
        execute: (command: string, ...args: readonly unknown[]) => execute(command, ...args)
      },
      items: [
        { id: "bold", iconClass: "ri-bold", command: "toggleBold" },
        createToolbarSeparatorItem("sep-inline"),
        { id: "italic", iconClass: "ri-italic", command: "toggleItalic" }
      ]
    });

    const separator = host.querySelector(`.${lexionToolbarAppearance.separatorClassName}`);
    expect(separator).not.toBeNull();
    expect(separator?.getAttribute("role")).toBe("separator");

    const buttons = Array.from(
      host.querySelectorAll<HTMLButtonElement>(`button[${lexionToolbarAppearance.itemIdAttribute}]`)
    );
    expect(buttons).toHaveLength(2);
    buttons[0]?.click();
    buttons[1]?.click();
    expect(execute).toHaveBeenCalledTimes(2);

    toolbar.hideItem("sep-inline");
    const hiddenSeparator = host.querySelector(`.${lexionToolbarAppearance.separatorClassName}`);
    expect(hiddenSeparator?.hasAttribute("hidden")).toBe(true);

    toolbar.destroy();
  });

  test("exposes icon constants for common toolbar actions", () => {
    expect(lexionToolbarIcons.bold).toBe("ri-bold");
    expect(lexionToolbarIcons.undo).toBe("ri-arrow-go-back-line");
    expect(lexionToolbarIcons.textFormat).toBe("ri-font-size");
  });

  test("prevents toolbar mousedown focus shift to preserve editor selection", () => {
    const host = document.createElement("div");
    const toolbar = createLexionToolbar({
      element: host,
      items: [{ id: "bold", iconClass: lexionToolbarIcons.bold, command: "toggleBold" }]
    });

    const button = host.querySelector<HTMLButtonElement>(
      `button[${lexionToolbarAppearance.itemIdAttribute}="bold"]`
    );
    expect(button).not.toBeNull();

    const mouseDown = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      button: 0
    });
    const dispatchResult = button?.dispatchEvent(mouseDown);
    expect(dispatchResult).toBe(false);
    expect(mouseDown.defaultPrevented).toBe(true);

    const pointerDown = new MouseEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      button: 0
    });
    const pointerDispatchResult = button?.dispatchEvent(pointerDown);
    expect(pointerDispatchResult).toBe(false);
    expect(pointerDown.defaultPrevented).toBe(true);

    toolbar.destroy();
  });

  test("focuses editor before executing command when focus is available", () => {
    const host = document.createElement("div");
    const focus = vi.fn();
    const execute = vi.fn<(...args: readonly unknown[]) => boolean>(() => true);

    const toolbar = createLexionToolbar({
      element: host,
      editor: {
        focus,
        execute: (command: string, ...args: readonly unknown[]) => execute(command, ...args)
      },
      items: [{ id: "bold", iconClass: lexionToolbarIcons.bold, command: "toggleBold" }]
    });

    const button = host.querySelector<HTMLButtonElement>(
      `button[${lexionToolbarAppearance.itemIdAttribute}="bold"]`
    );
    button?.click();

    expect(focus).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(focus.mock.invocationCallOrder[0]).toBeLessThan(execute.mock.invocationCallOrder[0]);

    toolbar.destroy();
  });
});
