import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { EditorView } from "prosemirror-view";
import {
  LexionEditor,
  lexionStatusBarAppearance,
  type JSONDocument,
  type LexionStatusBarItem
} from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";

export interface LexionEditorViewProps {
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  readonly onReady?: (editor: LexionEditor) => void;
  readonly readOnly?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const serializeJSON = (document: JSONDocument): string => JSON.stringify(document);
const STATUS_BAR_STYLE = lexionStatusBarAppearance.style as CSSProperties;
const STATUS_BAR_START_STYLE = lexionStatusBarAppearance.groupStyles.start as CSSProperties;
const STATUS_BAR_END_STYLE = lexionStatusBarAppearance.groupStyles.end as CSSProperties;
const PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE =
  "white-space: pre-wrap !important; word-wrap: break-word !important; -webkit-font-variant-ligatures: none; font-variant-ligatures: none;";

const splitStatusBarItems = (items: readonly LexionStatusBarItem[]) => ({
  start: items.filter((item) => (item.align ?? "start") === "start"),
  end: items.filter((item) => (item.align ?? "start") === "end")
});

export const LexionEditorView = ({
  editor,
  value,
  defaultValue,
  onChange,
  onReady,
  readOnly = false,
  className,
  style
}: LexionEditorViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const latestOnChange = useRef(onChange);
  const latestOnReady = useRef(onReady);
  const latestReadOnly = useRef(readOnly);
  const lastAppliedValueRef = useRef<string | null>(null);

  const internalEditor = useMemo(
    () => {
      const initialDoc = value ?? defaultValue;
      const editorOptions =
        initialDoc === undefined
          ? {
              extensions: [starterKitExtension]
            }
          : {
              doc: initialDoc,
              extensions: [starterKitExtension]
            };
      return new LexionEditor(editorOptions);
    },
    []
  );

  const activeEditor = editor ?? internalEditor;
  const isControlled = value !== undefined;
  const [statusBarItems, setStatusBarItems] = useState<readonly LexionStatusBarItem[]>(
    () => activeEditor.getStatusBarItems()
  );
  const statusBar = splitStatusBarItems(statusBarItems);

  latestOnChange.current = onChange;
  latestOnReady.current = onReady;
  latestReadOnly.current = readOnly;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (isControlled && value !== undefined) {
      const nextValue = serializeJSON(value);
      if (nextValue !== serializeJSON(activeEditor.getJSON())) {
        activeEditor.setJSON(value);
      }
      lastAppliedValueRef.current = nextValue;
    }

    const view = new EditorView(containerRef.current, {
      state: activeEditor.state,
      attributes: {
        style: PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE
      },
      editable: () => !latestReadOnly.current,
      dispatchTransaction: (transaction) => {
        activeEditor.dispatchTransaction(transaction);
        view.updateState(activeEditor.state);
        setStatusBarItems(activeEditor.getStatusBarItems());

        const nextValue = activeEditor.getJSON();
        lastAppliedValueRef.current = serializeJSON(nextValue);
        latestOnChange.current?.(nextValue, activeEditor);
      }
    });

    viewRef.current = view;
    setStatusBarItems(activeEditor.getStatusBarItems());
    latestOnReady.current?.(activeEditor);

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [activeEditor]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }
    view.setProps({
      editable: () => !latestReadOnly.current
    });
  }, [readOnly]);

  useEffect(() => {
    if (!isControlled || value === undefined) {
      return;
    }

    const nextValue = serializeJSON(value);
    if (nextValue === lastAppliedValueRef.current || nextValue === serializeJSON(activeEditor.getJSON())) {
      lastAppliedValueRef.current = nextValue;
      viewRef.current?.updateState(activeEditor.state);
      setStatusBarItems(activeEditor.getStatusBarItems());
      return;
    }

    activeEditor.setJSON(value);
    lastAppliedValueRef.current = nextValue;
    viewRef.current?.updateState(activeEditor.state);
    setStatusBarItems(activeEditor.getStatusBarItems());
  }, [activeEditor, isControlled, value]);

  useEffect(
    () => () => {
      if (!editor) {
        internalEditor.destroy();
      }
    },
    [editor, internalEditor]
  );

  return (
    <div
      className={className}
      style={{
        ...(style ?? {}),
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div ref={containerRef} />
      <div className={lexionStatusBarAppearance.className} style={STATUS_BAR_STYLE}>
        <div
          className={`${lexionStatusBarAppearance.groupClassName} ${lexionStatusBarAppearance.groupClassName}--start`}
          style={STATUS_BAR_START_STYLE}
        >
          {statusBar.start.map((item) => (
            <div
              key={item.key}
              className={
                item.className
                  ? `${lexionStatusBarAppearance.itemClassName} ${item.className}`
                  : lexionStatusBarAppearance.itemClassName
              }
              style={item.style as CSSProperties | undefined}
            >
              {item.text}
            </div>
          ))}
        </div>
        <div
          className={`${lexionStatusBarAppearance.groupClassName} ${lexionStatusBarAppearance.groupClassName}--end`}
          style={STATUS_BAR_END_STYLE}
        >
          {statusBar.end.map((item) => (
            <div
              key={item.key}
              className={
                item.className
                  ? `${lexionStatusBarAppearance.itemClassName} ${item.className}`
                  : lexionStatusBarAppearance.itemClassName
              }
              style={item.style as CSSProperties | undefined}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
