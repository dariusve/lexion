"use client";

import { useState } from "react";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionNextEditorView } from "@lexion-rte/next";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

export default function Page() {
  const [value, setValue] = useState<JSONDocument>(createDoc("Hello from @lexion-rte/next"));
  const [readOnly, setReadOnly] = useState(false);

  return (
    <main className="shell">
      <h1>Next Adapter Sample</h1>
      <div className="toolbar">
        <button type="button" onClick={() => setReadOnly((next) => !next)}>
          {readOnly ? "Set Editable" : "Toggle Read Only"}
        </button>
      </div>
      <section className="editor">
        <LexionNextEditorView
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          readOnly={readOnly}
        />
      </section>
      <pre className="state">{JSON.stringify(value, null, 2)}</pre>
    </main>
  );
}
