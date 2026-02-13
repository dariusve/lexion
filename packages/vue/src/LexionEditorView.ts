import { LexionEditor, type JSONDocument } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";
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
const FOOTER_TEXT = "Open Source Limited Version";

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

    const setActiveEditor = (nextEditor: LexionEditor): void => {
      activeEditorRef.value = nextEditor;
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
        editable: () => !props.readOnly,
        dispatchTransaction: (transaction) => {
          editor.dispatchTransaction(transaction);
          view.updateState(editor.state);

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
        activeEditorRef.value.setJSON(props.modelValue);
        lastAppliedValueRef.value = serializeJSON(props.modelValue);
      }

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
        if (serialized === lastAppliedValueRef.value) {
          return;
        }

        editor.setJSON(nextValue);
        lastAppliedValueRef.value = serialized;
        viewRef.value?.updateState(editor.state);
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
              class: "lexion-editor-footer",
              style: {
                padding: "8px 12px",
                borderTop: "1px solid #d7d7d7",
                background: "#f7f7f7",
                color: "#4a4a4a",
                fontSize: "12px",
                lineHeight: "1.3",
                textAlign: "center",
                fontFamily:
                  "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
              }
            },
            FOOTER_TEXT
          )
        ]
      );
  }
});
