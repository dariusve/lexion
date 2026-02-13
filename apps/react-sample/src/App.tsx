import { useState } from "react";

import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/react";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

export const App = () => {
  const [value, setValue] = useState<JSONDocument>(createDoc("Hello from @lexion-rte/react"));
  const [readOnly, setReadOnly] = useState(false);

  return (
    <main className="shell">
      <h1>React Adapter Sample</h1>
      <div className="toolbar">
        <button type="button" onClick={() => setReadOnly((next) => !next)}>
          {readOnly ? "Set Editable" : "Toggle Read Only"}
        </button>
      </div>
      <section className="editor">
        <LexionEditorView value={value} onChange={(nextValue) => setValue(nextValue)} readOnly={readOnly} />
      </section>
      <pre className="state">{JSON.stringify(value, null, 2)}</pre>
    </main>
  );
};
