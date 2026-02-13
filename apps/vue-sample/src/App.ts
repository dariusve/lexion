import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/vue";
import { defineComponent, h, ref } from "vue";

const createParagraphDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

export const App = defineComponent({
  name: "LexionVueSampleApp",
  setup() {
    const controlledDocument = ref<JSONDocument>(
      createParagraphDoc("Controlled editor value from Vue state")
    );

    return () =>
      h("main", { class: "page" }, [
        h("h1", "Lexion Vue Local Sample"),
        h("p", "Uses workspace packages (@lexion-rte/core and @lexion-rte/vue) without publishing to npm."),

        h("section", { class: "card" }, [
          h("h2", "Uncontrolled"),
          h(LexionEditorView, {
            defaultValue: createParagraphDoc("Uncontrolled editor")
          })
        ]),

        h("section", { class: "card" }, [
          h("h2", "Controlled"),
          h(LexionEditorView, {
            modelValue: controlledDocument.value,
            "onUpdate:modelValue": (nextDocument: JSONDocument) => {
              controlledDocument.value = nextDocument;
            }
          }),
          h("h3", "Current JSON"),
          h("pre", JSON.stringify(controlledDocument.value, null, 2))
        ])
      ]);
  }
});
