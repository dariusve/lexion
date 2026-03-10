<template>
  <main class="shell">
    <h1>Nuxt Adapter Sample</h1>
    <p>Select text to test inline formatting and links. Place the cursor in the list to test indent and outdent.</p>
    <div class="toolbar">
      <button
        v-for="button in toolbarButtons"
        :key="button.label"
        type="button"
        @click="runCommand(button)"
      >
        {{ button.label }}
      </button>
      <button type="button" @click="toggleReadOnly">
        {{ readOnly ? "Set Editable" : "Toggle Read Only" }}
      </button>
    </div>
    <section class="editor">
      <ClientOnly>
        <LexionNuxtEditorView
          :editor="editor"
          :model-value="value"
          :read-only="readOnly"
          @update:model-value="onUpdate"
        />
      </ClientOnly>
    </section>
    <pre class="state">{{ pretty }}</pre>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionNuxtEditorView } from "@lexion-rte/nuxt";

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

const editor = new LexionEditor({
  doc: createDoc(),
  extensions: [starterKitExtension]
});
const value = ref<JSONDocument>(editor.getJSON());
const readOnly = ref(false);

const pretty = computed(() => JSON.stringify(value.value, null, 2));

const runCommand = (button: ToolbarButtonConfig): void => {
  editor.execute(button.command, ...(button.args ?? []));
  value.value = editor.getJSON();
};

const toggleReadOnly = (): void => {
  readOnly.value = !readOnly.value;
};

const onUpdate = (nextValue: JSONDocument): void => {
  value.value = nextValue;
};

onBeforeUnmount(() => {
  editor.destroy();
});
</script>
