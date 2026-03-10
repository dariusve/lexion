import { useEffect, useMemo, useState, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/react";

import type { PlaygroundExampleHandle } from "./vue-examples.js";
import {
  createStarterKitSampleDocument,
  fullStarterKitToolbarButtons,
  type ToolbarButtonConfig
} from "./starter-kit-buttons.js";

const ReactToolbarExample = () => {
  const editor = useMemo(
    () =>
      new LexionEditor({
        doc: createStarterKitSampleDocument(),
        extensions: [starterKitExtension]
      }),
    []
  );
  const [document, setDocument] = useState<JSONDocument>(() => editor.getJSON());

  useEffect(
    () => () => {
      editor.destroy();
    },
    [editor]
  );

  const runCommand = (button: ToolbarButtonConfig): void => {
    editor.execute(button.command, ...(button.args ?? []));
    setDocument(editor.getJSON());
  };

  return (
    <div className="lexion-example lexion-example--toolbar">
      <h3>React Full Toolbar</h3>
      <div className="lexion-toolbar">
        {fullStarterKitToolbarButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand(button)}
          >
            {button.label}
          </button>
        ))}
      </div>
      <LexionEditorView
        editor={editor}
        value={document}
        onChange={(nextDocument) => setDocument(nextDocument)}
      />
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </div>
  );
};

export const mountReactToolbarExample = (element: HTMLElement): PlaygroundExampleHandle => {
  let root: Root | null = createRoot(element);
  root.render(createElement(ReactToolbarExample));

  return {
    unmount: () => {
      root?.unmount();
      root = null;
    }
  };
};
