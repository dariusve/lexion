import Vue from "vue/dist/vue.esm.js";

import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/extensions";
import { createLexionVue2Adapter, type LexionVue2Adapter } from "@lexion-rte/vue2";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

type AppVm = Vue & {
  adapter: LexionVue2Adapter | null;
  readOnly: boolean;
  state: string;
};

export const App = Vue.extend({
  name: "LexionVue2SampleApp",
  data() {
    return {
      adapter: null as LexionVue2Adapter | null,
      readOnly: false,
      state: JSON.stringify(createDoc("Hello from @lexion-rte/vue2"), null, 2)
    };
  },
  mounted() {
    const vm = this as AppVm;
    const editorHost = vm.$refs.editorHost as HTMLElement | undefined;
    if (!editorHost) {
      throw new Error("Missing editor host ref");
    }

    vm.adapter = createLexionVue2Adapter({
      defaultValue: createDoc("Hello from @lexion-rte/vue2"),
      onChange: (value) => {
        vm.state = JSON.stringify(value, null, 2);
      }
    });

    vm.adapter.mount(editorHost);

    if (vm.adapter.editor) {
      vm.state = JSON.stringify(vm.adapter.editor.getJSON(), null, 2);
    }
  },
  beforeDestroy() {
    const vm = this as AppVm;
    vm.adapter?.destroy();
  },
  methods: {
    toggleBold() {
      const vm = this as AppVm;
      vm.adapter?.execute(starterKitCommandNames.toggleBold);
    },
    toggleReadOnly() {
      const vm = this as AppVm;
      if (!vm.adapter) {
        return;
      }

      vm.readOnly = !vm.readOnly;
      vm.adapter.setReadOnly(vm.readOnly);
    }
  },
  render(h) {
    const vm = this as AppVm;
    return h("main", { class: "shell" }, [
      h("h1", "Vue2 Adapter Sample"),
      h("div", { class: "toolbar" }, [
        h(
          "button",
          {
            attrs: { type: "button" },
            on: {
              click: vm.toggleBold
            }
          },
          "Toggle Bold"
        ),
        h(
          "button",
          {
            attrs: { type: "button" },
            on: {
              click: vm.toggleReadOnly
            }
          },
          vm.readOnly ? "Set Editable" : "Toggle Read Only"
        )
      ]),
      h("section", { class: "editor", ref: "editorHost" }),
      h("pre", { class: "state" }, vm.state)
    ]);
  }
});
