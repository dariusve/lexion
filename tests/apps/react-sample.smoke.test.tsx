import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, test, vi } from "vitest";

import { App } from "../../apps/react-sample/src/App.js";

describe("apps/react-sample", () => {
  test("runs under StrictMode and its toolbar updates the view", async () => {
    const consoleError = vi.spyOn(console, "error");
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    });
    expect(container.querySelectorAll(".ProseMirror")).toHaveLength(1);

    const headingButton = [...container.querySelectorAll("button")].find((button) =>
      /H2|Heading 2/i.test(button.textContent ?? "")
    );
    expect(headingButton).toBeDefined();
    await act(async () => {
      headingButton!.click();
    });
    expect(container.querySelector(".ProseMirror h2")).not.toBeNull();
    expect(container.querySelector("pre.state")?.textContent).toContain('"heading"');

    await act(async () => {
      root.unmount();
    });
    container.remove();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
