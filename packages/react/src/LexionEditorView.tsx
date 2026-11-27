import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
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

export interface LexionEditorViewProps {
  readonly editor?: LexionEditor;
  readonly value?: JSONDocument;
  readonly defaultValue?: JSONDocument;
  readonly onChange?: (value: JSONDocument, editor: LexionEditor) => void;
  readonly onReady?: (editor: LexionEditor) => void;
  readonly readOnly?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  /** Accessible name for the editable area. */
  readonly ariaLabel?: string;
  /** Id(s) of the element(s) labelling the editable area. */
  readonly ariaLabelledBy?: string;
  /** Inject the default editor/status bar stylesheet (default `true`). */
  readonly injectStyles?: boolean;
}

const StatusBarGroup = ({
  align,
  items
}: {
  readonly align: "start" | "end";
  readonly items: readonly LexionStatusBarItem[];
}) => (
  <div className={getStatusBarGroupClassName(align)}>
    {items.map((item) => (
      <div
        key={item.key}
        className={getStatusBarItemClassName(item)}
        style={item.style as CSSProperties | undefined}
      >
        {item.text}
      </div>
    ))}
  </div>
);

export const LexionEditorView = (props: LexionEditorViewProps) => {
  const { editor, value, readOnly = false, className, style, ariaLabel, ariaLabelledBy } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<LexionViewController | null>(null);
  const latestProps = useRef(props);
  latestProps.current = props;
  const hasOnChange = props.onChange !== undefined;
  const [statusBarItems, setStatusBarItems] = useState<readonly LexionStatusBarItem[]>([]);
  const statusBar = splitStatusBarItems(statusBarItems);

  // The controller (and the internal editor it creates when `editor` is not passed) is
  // created and destroyed in the same effect, so StrictMode's mount/unmount/remount
  // cycle always gets a fresh, live instance.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const initial = latestProps.current;
    const controller = new LexionViewController({
      element,
      readOnly: initial.readOnly ?? false,
      injectStyles: initial.injectStyles !== false,
      onStatusBarChange: setStatusBarItems,
      ...(editor !== undefined ? { editor } : {}),
      ...(initial.value !== undefined ? { value: initial.value } : {}),
      ...(initial.defaultValue !== undefined ? { defaultValue: initial.defaultValue } : {}),
      ...(initial.ariaLabel !== undefined ? { ariaLabel: initial.ariaLabel } : {}),
      ...(initial.ariaLabelledBy !== undefined ? { ariaLabelledBy: initial.ariaLabelledBy } : {})
    });
    controllerRef.current = controller;
    latestProps.current.onReady?.(controller.editor);

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [editor]);

  // Only install a change handler when there is one, so the document is not serialized
  // to JSON for nobody.
  useEffect(() => {
    controllerRef.current?.setOnChange(
      hasOnChange
        ? (nextValue, activeEditor) => latestProps.current.onChange?.(nextValue, activeEditor)
        : undefined
    );
  }, [editor, hasOnChange]);

  useEffect(() => {
    controllerRef.current?.setReadOnly(readOnly);
  }, [editor, readOnly]);

  useEffect(() => {
    controllerRef.current?.setAccessibility({
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
      ...(ariaLabelledBy !== undefined ? { ariaLabelledBy } : {})
    });
  }, [editor, ariaLabel, ariaLabelledBy]);

  useEffect(() => {
    if (value !== undefined) {
      controllerRef.current?.setValue(value);
    }
  }, [editor, value]);

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
      <div className={lexionStatusBarAppearance.className}>
        <StatusBarGroup align="start" items={statusBar.start} />
        <StatusBarGroup align="end" items={statusBar.end} />
      </div>
    </div>
  );
};
