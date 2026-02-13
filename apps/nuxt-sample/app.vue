<template>
  <main class="shell">
    <h1>Nuxt Adapter Sample</h1>
    <div class="toolbar">
      <button type="button" @click="toggleReadOnly">
        {{ readOnly ? "Set Editable" : "Toggle Read Only" }}
      </button>
    </div>
    <section class="editor">
      <ClientOnly>
        <LexionNuxtEditorView
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
import { computed, ref } from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionNuxtEditorView } from "@lexion-rte/nuxt";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

const value = ref<JSONDocument>(createDoc("Hello from @lexion-rte/nuxt"));
const readOnly = ref(false);

const pretty = computed(() => JSON.stringify(value.value, null, 2));

const toggleReadOnly = (): void => {
  readOnly.value = !readOnly.value;
};

const onUpdate = (nextValue: JSONDocument): void => {
  value.value = nextValue;
};
</script>
