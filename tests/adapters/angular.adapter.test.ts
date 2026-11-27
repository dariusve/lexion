import { describe, expect, test, vi } from "vitest";

import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionAngularAdapter } from "@lexion-rte/angular";

import { createDoc, editableRoot } from "../helpers/documents.js";

describe("@lexion-rte/angular", () => {
  test("implements the ControlValueAccessor flow", () => {
    const container = document.createElement("div");
    const onChange = vi.fn();
    const formOnChange = vi.fn();
    const formOnTouched = vi.fn();
    const adapter = createLexionAngularAdapter({
      defaultValue: createDoc("hello"),
      onChange,
      ariaLabelledBy: "label-id"
    });
    adapter.registerOnChange(formOnChange);
    adapter.registerOnTouched(formOnTouched);

    adapter.attach(container);
    const root = editableRoot(container);
    expect(root.textContent).toBe("hello");
    expect(root.getAttribute("aria-labelledby")).toBe("label-id");

    // writeValue comes from the form model and must not be echoed back.
    adapter.writeValue(createDoc("from form"));
    expect(editableRoot(container).textContent).toBe("from form");
    expect(formOnChange).not.toHaveBeenCalled();

    adapter.setDisabledState(true);
    expect(editableRoot(container).getAttribute("contenteditable")).toBe("false");
    adapter.setDisabledState(false);

    adapter.editor?.execute(starterKitCommandNames.toggleHeading, 2);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(formOnChange).toHaveBeenCalledTimes(1);

    container.dispatchEvent(new FocusEvent("focusout"));
    expect(formOnTouched).toHaveBeenCalledTimes(1);

    adapter.destroy();
    expect(container.querySelector(".ProseMirror")).toBeNull();
    expect(adapter.editor).toBeNull();

    // Detached: the listener is gone.
    container.dispatchEvent(new FocusEvent("focusout"));
    expect(formOnTouched).toHaveBeenCalledTimes(1);
  });
});
