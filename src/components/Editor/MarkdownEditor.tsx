import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTranslation } from "react-i18next";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  darkMode?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  darkMode = false,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      keymap.of(defaultKeymap),
      EditorView.editable.of(!readOnly),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
    ];

    if (!readOnly) {
      extensions.push(
        placeholder(t("editor.placeholder"))
      );
    }

    if (darkMode) {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [readOnly, darkMode]);

  useEffect(() => {
    if (!viewRef.current) return;
    const currentDoc = viewRef.current.state.doc.toString();
    if (value !== currentDoc) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <Box
      ref={editorRef}
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        "& .cm-editor": {
          height: "100%",
          fontSize: "14px",
          lineHeight: 1.6,
        },
        "& .cm-editor .cm-scroller": {
          fontFamily:
            '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        },
        "& .cm-editor.cm-focused": {
          outline: "none",
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    />
  );
}
