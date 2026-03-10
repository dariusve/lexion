import { useEffect, useMemo, useState } from "react";

import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/react";

interface ToolbarButtonConfig {
  readonly label: string;
  readonly command: string;
  readonly args?: readonly unknown[];
}

const LINK_ATTRIBUTES = {
  href: "https://lexion.dev",
  title: "Lexion"
} as const;

const toolbarButtons: readonly ToolbarButtonConfig[] = [
  { label: "Paragraph", command: starterKitCommandNames.setParagraph },
  { label: "H1", command: starterKitCommandNames.toggleHeading, args: [1] },
  { label: "H2", command: starterKitCommandNames.toggleHeading, args: [2] },
  { label: "H3", command: starterKitCommandNames.toggleHeading, args: [3] },
  { label: "Bold", command: starterKitCommandNames.toggleBold },
  { label: "Italic", command: starterKitCommandNames.toggleItalic },
  { label: "Code", command: starterKitCommandNames.toggleCode },
  { label: "Strike", command: starterKitCommandNames.toggleStrike },
  { label: "Underline", command: starterKitCommandNames.toggleUnderline },
  { label: "Quote", command: starterKitCommandNames.toggleBlockquote },
  { label: "Code Block", command: starterKitCommandNames.toggleCodeBlock },
  { label: "Bullet List", command: starterKitCommandNames.wrapBulletList },
  { label: "Ordered List", command: starterKitCommandNames.wrapOrderedList },
  { label: "Outdent", command: starterKitCommandNames.liftListItem },
  { label: "Indent", command: starterKitCommandNames.sinkListItem },
  { label: "Set Link", command: starterKitCommandNames.setLink, args: [LINK_ATTRIBUTES] },
  { label: "Unset Link", command: starterKitCommandNames.unsetLink },
  { label: "Rule", command: starterKitCommandNames.insertHorizontalRule },
  { label: "Break", command: starterKitCommandNames.insertHardBreak },
  { label: "Undo", command: starterKitCommandNames.undo },
  { label: "Redo", command: starterKitCommandNames.redo }
];

const createDoc = (): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Select text to try inline marks, links, and block transforms." }]
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Use the toolbar to compare the full starter-kit command set." }]
    },
    {
      type: "bullet_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "List item for indent and outdent commands" }]
            }
          ]
        }
      ]
    }
  ]
});

export const App = () => {
  const editor = useMemo(
    () =>
      new LexionEditor({
        doc: createDoc(),
        extensions: [starterKitExtension]
      }),
    []
  );
  const [value, setValue] = useState<JSONDocument>(() => editor.getJSON());
  const [readOnly, setReadOnly] = useState(false);

  useEffect(
    () => () => {
      editor.destroy();
    },
    [editor]
  );

  const runCommand = (button: ToolbarButtonConfig): void => {
    editor.execute(button.command, ...(button.args ?? []));
    setValue(editor.getJSON());
  };

  return (
    <main className="shell">
      <h1>React Adapter Sample</h1>
      <p>Select text to test inline formatting and links. Place the cursor in the list to test indent and outdent.</p>
      <div className="toolbar">
        {toolbarButtons.map((button) => (
          <button key={button.label} type="button" onClick={() => runCommand(button)}>
            {button.label}
          </button>
        ))}
        <button type="button" onClick={() => setReadOnly((next) => !next)}>
          {readOnly ? "Set Editable" : "Toggle Read Only"}
        </button>
      </div>
      <section className="editor">
        <LexionEditorView
          editor={editor}
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          readOnly={readOnly}
        />
      </section>
      <pre className="state">{JSON.stringify(value, null, 2)}</pre>
    </main>
  );
};
