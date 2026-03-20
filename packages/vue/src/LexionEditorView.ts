import {
  LexionEditor,
  lexionStatusBarAppearance,
  type JSONDocument,
  type LexionStatusBarItem
} from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { EditorView } from "prosemirror-view";
import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type PropType,
  type StyleValue
} from "vue";

export interface LexionEditorViewProps {
  readonly editor?: LexionEditor;
  readonly modelValue?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly className?: string;
  readonly style?: StyleValue;
}

export interface LexionEditorViewEmits {
  (event: "update:modelValue", value: JSONDocument): void;
  (event: "change", value: JSONDocument, editor: LexionEditor): void;
  (event: "ready", editor: LexionEditor): void;
}

const serializeJSON = (document: JSONDocument): string => JSON.stringify(document);
const PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE =
  "white-space: pre-wrap !important; word-wrap: break-word !important; -webkit-font-variant-ligatures: none; font-variant-ligatures: none;";

export const LexionEditorView = defineComponent({
  name: "LexionEditorView",
  props: {
    editor: {
      type: Object as PropType<LexionEditor>,
      default: undefined
    },
    modelValue: {
      type: Object as PropType<JSONDocument>,
      default: undefined
    },
    defaultValue: {
      type: Object as PropType<JSONDocument>,
      default: undefined
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: undefined
    },
    style: {
      type: [Object, Array, String] as PropType<StyleValue>,
      default: undefined
    }
  },
  emits: {
    "update:modelValue": (_value: JSONDocument): boolean => true,
    change: (_value: JSONDocument, _editor: LexionEditor): boolean => true,
    ready: (_editor: LexionEditor): boolean => true
  },
  setup(props, { emit }) {
    const containerRef = ref<HTMLDivElement | null>(null);
    const viewRef = shallowRef<EditorView | null>(null);
    const ownsEditorRef = ref(false);
    const activeEditorRef = shallowRef<LexionEditor | null>(null);
    const lastAppliedValueRef = ref<string | null>(null);
    const statusBarItemsRef = ref<readonly LexionStatusBarItem[]>([]);

    const setActiveEditor = (nextEditor: LexionEditor): void => {
      activeEditorRef.value = nextEditor;
    };

    const syncStatusBar = (): void => {
      statusBarItemsRef.value = activeEditorRef.value?.getStatusBarItems() ?? [];
    };

    const createInternalEditor = (): LexionEditor =>
      new LexionEditor(
        props.defaultValue === undefined
          ? {
              extensions: [starterKitExtension]
            }
          : {
              doc: props.defaultValue,
              extensions: [starterKitExtension]
            }
      );

    const destroyView = (): void => {
      viewRef.value?.destroy();
      viewRef.value = null;
    };

    const recreateView = (): void => {
      if (!containerRef.value || !activeEditorRef.value) {
        return;
      }

      destroyView();

      const editor = activeEditorRef.value;
      const view = new EditorView(containerRef.value, {
        state: editor.state,
        attributes: {
          style: PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE
        },
        editable: () => !props.readOnly,
        dispatchTransaction: (transaction) => {
          editor.dispatchTransaction(transaction);
          view.updateState(editor.state);
          syncStatusBar();

          const nextValue = editor.getJSON();
          lastAppliedValueRef.value = serializeJSON(nextValue);
          emit("update:modelValue", nextValue);
          emit("change", nextValue, editor);
        }
      });

      viewRef.value = view;
      emit("ready", editor);
    };

    onMounted(() => {
      if (props.editor) {
        ownsEditorRef.value = false;
        setActiveEditor(props.editor);
      } else {
        ownsEditorRef.value = true;
        setActiveEditor(createInternalEditor());
      }

      if (props.modelValue !== undefined && activeEditorRef.value) {
        const nextValue = serializeJSON(props.modelValue);
        if (nextValue !== serializeJSON(activeEditorRef.value.getJSON())) {
          activeEditorRef.value.setJSON(props.modelValue);
        }
        lastAppliedValueRef.value = nextValue;
      }

      syncStatusBar();
      recreateView();
    });

    watch(
      () => props.editor,
      (nextEditor, previousEditor) => {
        if (nextEditor === previousEditor || !containerRef.value) {
          return;
        }

        if (!nextEditor) {
          if (!ownsEditorRef.value) {
            ownsEditorRef.value = true;
            setActiveEditor(createInternalEditor());
          }
        } else {
          if (ownsEditorRef.value && activeEditorRef.value) {
            activeEditorRef.value.destroy();
          }
          ownsEditorRef.value = false;
          setActiveEditor(nextEditor);
        }

        recreateView();
        syncStatusBar();
      }
    );

    watch(
      () => props.readOnly,
      () => {
        const view = viewRef.value;
        if (!view) {
          return;
        }
        view.setProps({
          editable: () => !props.readOnly
        });
      }
    );

    watch(
      () => props.modelValue,
      (nextValue) => {
        const editor = activeEditorRef.value;
        if (!editor || nextValue === undefined) {
          return;
        }

        const serialized = serializeJSON(nextValue);
        if (serialized === lastAppliedValueRef.value || serialized === serializeJSON(editor.getJSON())) {
          lastAppliedValueRef.value = serialized;
          viewRef.value?.updateState(editor.state);
          syncStatusBar();
          return;
        }

        editor.setJSON(nextValue);
        lastAppliedValueRef.value = serialized;
        viewRef.value?.updateState(editor.state);
        syncStatusBar();
      },
      {
        immediate: true
      }
    );

    onBeforeUnmount(() => {
      destroyView();
      if (ownsEditorRef.value && activeEditorRef.value) {
        activeEditorRef.value.destroy();
      }
      activeEditorRef.value = null;
    });

    return () =>
      h(
        "div",
        {
          class: props.className,
          style: [props.style, { display: "flex", flexDirection: "column" }]
        },
        [
          h("div", {
            ref: containerRef
          }),
          h(
            "div",
            {
              class: lexionStatusBarAppearance.className,
              style: lexionStatusBarAppearance.style
            },
            [
              h(
                "div",
                {
                  class: `${lexionStatusBarAppearance.groupClassName} ${lexionStatusBarAppearance.groupClassName}--start`,
                  style: lexionStatusBarAppearance.groupStyles.start
                },
                statusBarItemsRef.value
                  .filter((item) => (item.align ?? "start") === "start")
                  .map((item) =>
                    h(
                      "div",
                      {
                        key: item.key,
                        class: item.className
                          ? `${lexionStatusBarAppearance.itemClassName} ${item.className}`
                          : lexionStatusBarAppearance.itemClassName,
                        style: item.style
                      },
                      item.text
                    )
                  )
              ),
              h(
                "div",
                {
                  class: `${lexionStatusBarAppearance.groupClassName} ${lexionStatusBarAppearance.groupClassName}--end`,
                  style: lexionStatusBarAppearance.groupStyles.end
                },
                statusBarItemsRef.value
                  .filter((item) => (item.align ?? "start") === "end")
                  .map((item) =>
                    h(
                      "div",
                      {
                        key: item.key,
                        class: item.className
                          ? `${lexionStatusBarAppearance.itemClassName} ${item.className}`
                          : lexionStatusBarAppearance.itemClassName,
                        style: item.style
                      },
                      item.text
                    )
                  )
              )
            ]
          )
        ]
      );
  }
});
