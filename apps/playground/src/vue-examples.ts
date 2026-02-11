import type { JSONDocument } from "@lexion/core";
import { LexionEditorView } from "@lexion/vue";
import { createApp, defineComponent, h, ref } from "vue";

export interface PlaygroundExampleHandle {
  readonly unmount: () => void;
}

const createInitialDocument = (): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Start editing..." }]
    }
  ]
});

const createHandle = (unmount: () => void): PlaygroundExampleHandle => ({
  unmount
});

export const mountVueUncontrolledExample = (element: HTMLElement): PlaygroundExampleHandle => {
  const App = defineComponent({
    name: "VueUncontrolledExample",
    setup() {
      return () =>
        h("div", { class: "lexion-example lexion-example--uncontrolled" }, [
          h("h3", "Vue Uncontrolled"),
          h(LexionEditorView, {
            defaultValue: createInitialDocument()
          })
        ]);
    }
  });

  const app = createApp(App);
  app.mount(element);
  return createHandle(() => app.unmount());
};

export const mountVueControlledExample = (element: HTMLElement): PlaygroundExampleHandle => {
  const App = defineComponent({
    name: "VueControlledExample",
    setup() {
      const document = ref<JSONDocument>(createInitialDocument());

      return () =>
        h("div", { class: "lexion-example lexion-example--controlled" }, [
          h("h3", "Vue Controlled"),
          h(LexionEditorView, {
            modelValue: document.value,
            "onUpdate:modelValue": (nextDocument: JSONDocument) => {
              document.value = nextDocument;
            }
          }),
          h("pre", JSON.stringify(document.value, null, 2))
        ]);
    }
  });

  const app = createApp(App);
  app.mount(element);
  return createHandle(() => app.unmount());
};
