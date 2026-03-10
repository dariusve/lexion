import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/vue";
import { defineComponent, h, onBeforeUnmount, ref } from "vue";

interface ToolbarButtonConfig {
  readonly label: string;
  readonly command: string;
  readonly args?: readonly unknown[];
}

const LINK_ATTRIBUTES = {
  href: "https://lexion.app",
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

const createParagraphDoc = (): JSONDocument => ({
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
              content: [{ type: "text", text: "Parent list item" }]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Place the cursor here to test indent, then outdent." }]
            }
          ]
        }
      ]
    }
  ]
});

export const App = defineComponent({
  name: "LexionVueSampleApp",
  setup() {
    const editor = new LexionEditor({
      doc: createParagraphDoc(),
      extensions: [starterKitExtension]
    });
    const document = ref<JSONDocument>(editor.getJSON());
    const readOnly = ref(false);

    const runCommand = (button: ToolbarButtonConfig): void => {
      editor.execute(button.command, ...(button.args ?? []));
      document.value = editor.getJSON();
    };

    const toggleReadOnly = (): void => {
      readOnly.value = !readOnly.value;
    };

    onBeforeUnmount(() => {
      editor.destroy();
    });

    return () =>
      h("main", { class: "page" }, [
        h("h1", "Lexion Vue Local Sample"),
        h("p", "Uses a shared toolbar plus the Vue 3 editor view to exercise the full starter-kit command set."),
        h("p", "Select text for inline marks and links. Place the cursor in the second list item to test indent, then outdent."),
        h(
          "div",
          { class: "toolbar" },
          [
            ...toolbarButtons.map((button) =>
              h(
                "button",
                {
                  type: "button",
                  onMousedown: (event: MouseEvent) => event.preventDefault(),
                  onClick: () => runCommand(button)
                },
                button.label
              )
            ),
            h(
              "button",
              {
                type: "button",
                onMousedown: (event: MouseEvent) => event.preventDefault(),
                onClick: toggleReadOnly
              },
              readOnly.value ? "Set Editable" : "Toggle Read Only"
            )
          ]
        ),
        h("section", { class: "card" }, [
          h(LexionEditorView, {
            editor,
            modelValue: document.value,
            readOnly: readOnly.value,
            "onUpdate:modelValue": (nextDocument: JSONDocument) => {
              document.value = nextDocument;
            }
          }),
          h("h3", "Current JSON"),
          h("pre", JSON.stringify(document.value, null, 2))
        ])
      ]);
  }
});
