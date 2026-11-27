import { useEffect, useState, createElement } from "react";
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
  // Own the editor in an effect so create/destroy stay paired under StrictMode.
  const [editor, setEditor] = useState<LexionEditor | null>(null);
  const [document, setDocument] = useState<JSONDocument>(createStarterKitSampleDocument);

  useEffect(() => {
    const created = new LexionEditor({
      doc: createStarterKitSampleDocument(),
      extensions: [starterKitExtension]
    });
    setEditor(created);
    return () => {
      created.destroy();
    };
  }, []);

  const runCommand = (button: ToolbarButtonConfig): void => {
    // The view and `onChange` update through the editor subscription.
    editor?.execute(button.command, ...(button.args ?? []));
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
      {editor ? (
        <LexionEditorView
          editor={editor}
          value={document}
          onChange={(nextDocument) => setDocument(nextDocument)}
        />
      ) : null}
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
