import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { EditorView } from "prosemirror-view";
import { LexionEditor, type JSONDocument } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";

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

  latestOnChange.current = onChange;
  latestOnReady.current = onReady;
  latestReadOnly.current = readOnly;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (isControlled && value !== undefined) {
      activeEditor.setJSON(value);
      lastAppliedValueRef.current = serializeJSON(value);
    }

    const view = new EditorView(containerRef.current, {
      state: activeEditor.state,
      editable: () => !latestReadOnly.current,
      dispatchTransaction: (transaction) => {
        activeEditor.dispatchTransaction(transaction);
        view.updateState(activeEditor.state);

        const nextValue = activeEditor.getJSON();
        lastAppliedValueRef.current = serializeJSON(nextValue);
        latestOnChange.current?.(nextValue, activeEditor);
      }
    });

    viewRef.current = view;
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
    if (nextValue === lastAppliedValueRef.current) {
      return;
    }

    activeEditor.setJSON(value);
    lastAppliedValueRef.current = nextValue;
    viewRef.current?.updateState(activeEditor.state);
  }, [activeEditor, isControlled, value]);

  useEffect(
    () => () => {
      if (!editor) {
        internalEditor.destroy();
      }
    },
    [editor, internalEditor]
  );

  return <div className={className} style={style} ref={containerRef} />;
};
