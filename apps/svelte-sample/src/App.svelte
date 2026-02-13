<script lang="ts">
  import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
  import { starterKitCommandNames } from "@lexion-rte/extensions";
  import { lexion, type LexionSvelteActionOptions } from "@lexion-rte/svelte";

  const createDoc = (text: string): JSONDocument => ({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }]
      }
    ]
  });

  const initialValue = createDoc("Hello from @lexion-rte/svelte");

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

  const toggleBold = (): void => {
    editorRef?.execute(starterKitCommandNames.toggleBold);
  };

  const toggleReadOnly = (): void => {
    readOnly = !readOnly;
  };

</script>

<main class="shell">
  <h1>Svelte Adapter Sample</h1>
  <div class="toolbar">
    <button type="button" on:click={toggleBold}>Toggle Bold</button>
    <button type="button" on:click={toggleReadOnly}>
      {readOnly ? "Set Editable" : "Toggle Read Only"}
    </button>
  </div>
  <section class="editor" use:lexion={actionOptions}></section>
  <pre class="state">{JSON.stringify(value, null, 2)}</pre>
</main>
