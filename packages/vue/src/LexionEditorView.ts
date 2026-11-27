import {
  getStatusBarGroupClassName,
  getStatusBarItemClassName,
  lexionStatusBarAppearance,
  splitStatusBarItems,
  type JSONDocument,
  type LexionEditor,
  type LexionStatusBarItem
} from "@lexion-rte/core";
import { LexionViewController } from "@lexion-rte/web";
import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRaw,
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
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
  readonly injectStyles?: boolean;
}

export interface LexionEditorViewEmits {
  (event: "update:modelValue", value: JSONDocument): void;
  (event: "change", value: JSONDocument, editor: LexionEditor): void;
  (event: "ready", editor: LexionEditor): void;
}

const renderStatusBarGroup = (align: "start" | "end", items: readonly LexionStatusBarItem[]) =>
  h(
    "div",
    { class: getStatusBarGroupClassName(align) },
    items.map((item) =>
      h(
        "div",
        { key: item.key, class: getStatusBarItemClassName(item), style: item.style },
        item.text
      )
    )
  );

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
    const containerRef = ref<HTMLDivElement | null>(null);
    const controllerRef = shallowRef<LexionViewController | null>(null);
    const statusBarItemsRef = shallowRef<readonly LexionStatusBarItem[]>([]);

    // Parent refs wrap emitted objects in reactive proxies; the controller compares by
    // identity first, so always hand it the raw object.
    const rawModelValue = (): JSONDocument | undefined =>
      props.modelValue === undefined ? undefined : toRaw(props.modelValue);

    const accessibility = () => ({
      ...(props.ariaLabel !== undefined ? { ariaLabel: props.ariaLabel } : {}),
      ...(props.ariaLabelledBy !== undefined ? { ariaLabelledBy: props.ariaLabelledBy } : {})
    });

    const createController = (): void => {
      const element = containerRef.value;
      if (!element) {
        return;
      }

      const modelValue = rawModelValue();
      const controller = new LexionViewController({
        element,
        readOnly: props.readOnly,
        injectStyles: props.injectStyles,
        onStatusBarChange: (items) => {
          statusBarItemsRef.value = items;
        },
        onChange: (value, editor) => {
          emit("update:modelValue", value);
          emit("change", value, editor);
        },
        ...accessibility(),
        ...(props.editor !== undefined ? { editor: props.editor } : {}),
        ...(modelValue !== undefined ? { value: modelValue } : {}),
        ...(props.defaultValue !== undefined ? { defaultValue: props.defaultValue } : {})
      });
      controllerRef.value = controller;
      emit("ready", controller.editor);
    };

    const destroyController = (): void => {
      controllerRef.value?.destroy();
      controllerRef.value = null;
    };

    onMounted(createController);
    onBeforeUnmount(destroyController);

    watch(
      () => props.editor,
      (nextEditor, previousEditor) => {
        if (nextEditor === previousEditor || !containerRef.value) {
          return;
        }
        destroyController();
        createController();
      }
    );

    watch(
      () => props.readOnly,
      (readOnly) => {
        controllerRef.value?.setReadOnly(readOnly);
      }
    );

    watch([() => props.ariaLabel, () => props.ariaLabelledBy], () => {
      controllerRef.value?.setAccessibility(accessibility());
    });

    watch(
      () => props.modelValue,
      () => {
        const modelValue = rawModelValue();
        if (modelValue !== undefined) {
          controllerRef.value?.setValue(modelValue);
        }
      }
    );

    return () => {
      const statusBar = splitStatusBarItems(statusBarItemsRef.value);
      return h(
        "div",
        {
          class: props.className,
          style: [props.style, { display: "flex", flexDirection: "column" }]
        },
        [
          h("div", { ref: containerRef }),
          h("div", { class: lexionStatusBarAppearance.className }, [
            renderStatusBarGroup("start", statusBar.start),
            renderStatusBarGroup("end", statusBar.end)
          ])
        ]
      );
    };
  }
});
