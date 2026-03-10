<script lang="ts">
  import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
  import { starterKitCommandNames } from "@lexion-rte/starter-kit";
  import { lexion, type LexionSvelteActionOptions } from "@lexion-rte/svelte";

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

  const initialValue = createDoc();

  let readOnly = false;
  let editorRef: LexionEditor | null = null;
  let value: JSONDocument = initialValue;
  let actionOptions: LexionSvelteActionOptions;

  $: actionOptions = {
    value,
    readOnly,
    onReady: (editor: LexionEditor) => {
      editorRef = editor;
    },
    onChange: (nextValue: JSONDocument) => {
      value = nextValue;
    }
  } satisfies LexionSvelteActionOptions;

  const runCommand = (button: ToolbarButtonConfig): void => {
    if (!editorRef) {
      return;
    }

    editorRef.execute(button.command, ...(button.args ?? []));
    value = editorRef.getJSON();
  };

  const toggleReadOnly = (): void => {
    readOnly = !readOnly;
  };

</script>

<main class="shell">
  <h1>Svelte Adapter Sample</h1>
  <p>Select text to test inline formatting and links. Place the cursor in the list to test indent and outdent.</p>
  <div class="toolbar">
    {#each toolbarButtons as button (button.label)}
      <button type="button" on:click={() => runCommand(button)}>{button.label}</button>
    {/each}
    <button type="button" on:click={toggleReadOnly}>
      {readOnly ? "Set Editable" : "Toggle Read Only"}
    </button>
  </div>
  <section class="editor" use:lexion={actionOptions}></section>
  <pre class="state">{JSON.stringify(value, null, 2)}</pre>
</main>
