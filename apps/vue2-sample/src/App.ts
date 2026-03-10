import Vue from "vue/dist/vue.esm.js";

import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionVue2Adapter, type LexionVue2Adapter } from "@lexion-rte/vue2";

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
      state: JSON.stringify(createDoc(), null, 2)
    };
  },
  mounted() {
    const vm = this as AppVm;
    const editorHost = vm.$refs.editorHost as HTMLElement | undefined;
    if (!editorHost) {
      throw new Error("Missing editor host ref");
    }

    vm.adapter = createLexionVue2Adapter({
      defaultValue: createDoc(),
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
    runCommand(button: ToolbarButtonConfig) {
      const vm = this as AppVm;
      vm.adapter?.execute(button.command, ...(button.args ?? []));
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
      h("p", "Select text to test inline formatting and links. Place the cursor in the second list item to test indent, then outdent."),
      h("div", { class: "toolbar" }, [
        ...toolbarButtons.map((button) =>
          h(
            "button",
            {
              key: button.label,
              attrs: { type: "button" },
              on: {
                mousedown: (event: MouseEvent) => event.preventDefault(),
                click: () => vm.runCommand(button)
              }
            },
            button.label
          )
        ),
        h(
          "button",
          {
            attrs: { type: "button" },
            on: {
              mousedown: (event: MouseEvent) => event.preventDefault(),
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
