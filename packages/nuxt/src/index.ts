import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/vue";
import { defineComponent, h, onMounted, ref, type PropType, type StyleValue } from "vue";

export interface LexionNuxtEditorViewProps {
  readonly editor?: LexionEditor;
  readonly modelValue?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly readOnly?: boolean;
  readonly className?: string;
  readonly style?: StyleValue;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
  readonly injectStyles?: boolean;
}

export interface LexionNuxtEditorViewEmits {
  (event: "update:modelValue", value: JSONDocument): void;
  (event: "change", value: JSONDocument, editor: LexionEditor): void;
  (event: "ready", editor: LexionEditor): void;
}

export const LexionNuxtEditorView = defineComponent({
  name: "LexionNuxtEditorView",
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
    },
    ariaLabel: {
      type: String,
      default: undefined
    },
    ariaLabelledBy: {
      type: String,
      default: undefined
    },
    injectStyles: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "update:modelValue": (_value: JSONDocument): boolean => true,
    change: (_value: JSONDocument, _editor: LexionEditor): boolean => true,
    ready: (_editor: LexionEditor): boolean => true
  },
  setup(props, { emit }) {
    const mounted = ref(false);

    onMounted(() => {
      mounted.value = true;
    });

    return () => {
      if (!mounted.value) {
        return null;
      }

      const viewProps: {
        editor?: LexionEditor;
        modelValue?: JSONDocument;
        defaultValue?: JSONDocument;
        readOnly: boolean;
        injectStyles: boolean;
        ariaLabel?: string;
        ariaLabelledBy?: string;
        className?: string;
        style?: StyleValue;
        "onUpdate:modelValue": (value: JSONDocument) => void;
        onChange: (value: JSONDocument, editor: LexionEditor) => void;
        onReady: (editor: LexionEditor) => void;
      } = {
        readOnly: props.readOnly,
        injectStyles: props.injectStyles,
        "onUpdate:modelValue": (value: JSONDocument) => {
          emit("update:modelValue", value);
        },
        onChange: (value: JSONDocument, editor: LexionEditor) => {
          emit("change", value, editor);
        },
        onReady: (editor: LexionEditor) => {
          emit("ready", editor);
        }
      };

      if (props.editor !== undefined) {
        viewProps.editor = props.editor;
      }
      if (props.modelValue !== undefined) {
        viewProps.modelValue = props.modelValue;
      }
      if (props.defaultValue !== undefined) {
        viewProps.defaultValue = props.defaultValue;
      }
      if (props.ariaLabel !== undefined) {
        viewProps.ariaLabel = props.ariaLabel;
      }
      if (props.ariaLabelledBy !== undefined) {
        viewProps.ariaLabelledBy = props.ariaLabelledBy;
      }
      if (props.className !== undefined) {
        viewProps.className = props.className;
      }
      if (props.style !== undefined) {
        viewProps.style = props.style;
      }

      return h(LexionEditorView, viewProps);
    };
  }
});
