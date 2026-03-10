import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/vue";
import { createApp, defineComponent, h, onBeforeUnmount, ref } from "vue";
import {
  createStarterKitSampleDocument,
  fullStarterKitToolbarButtons,
  type ToolbarButtonConfig
} from "./starter-kit-buttons.js";

export interface PlaygroundExampleHandle {
  readonly unmount: () => void;
}

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
            defaultValue: createStarterKitSampleDocument()
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
      const document = ref<JSONDocument>(createStarterKitSampleDocument());

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

export const mountVueToolbarExample = (element: HTMLElement): PlaygroundExampleHandle => {
  const App = defineComponent({
    name: "VueToolbarExample",
    setup() {
      const editor = new LexionEditor({
        doc: createStarterKitSampleDocument(),
        extensions: [starterKitExtension]
      });
      const document = ref<JSONDocument>(editor.getJSON());

      const runCommand = (button: ToolbarButtonConfig): void => {
        editor.execute(button.command, ...(button.args ?? []));
        document.value = editor.getJSON();
      };

      onBeforeUnmount(() => {
        editor.destroy();
      });

      return () =>
        h("div", { class: "lexion-example lexion-example--toolbar" }, [
          h("h3", "Vue Full Toolbar"),
          h(
            "div",
            { class: "lexion-toolbar" },
            fullStarterKitToolbarButtons.map((button) =>
              h(
                "button",
                {
                  type: "button",
                  onClick: () => runCommand(button)
                },
                button.label
              )
            )
          ),
          h(LexionEditorView, {
            editor,
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
