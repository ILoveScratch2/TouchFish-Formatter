import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { MergeView } from "@codemirror/merge";
import { oneDark } from "@codemirror/theme-one-dark";

interface DiffViewProps {
  original: string;
  formatted: string;
  darkMode?: boolean;
}

export default function DiffView({
  original,
  formatted,
  darkMode = false,
}: DiffViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mergeRef = useRef<MergeView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions = [
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      EditorView.editable.of(false),
    ];

    const darkExt = darkMode ? [oneDark] : [];

    mergeRef.current = new MergeView({
      a: {
        doc: original,
        extensions: [...extensions, ...darkExt],
      },
      b: {
        doc: formatted,
        extensions: [...extensions, ...darkExt],
      },
      parent: containerRef.current,
      revertControls: "b-to-a",
    });

    return () => {
      mergeRef.current?.destroy();
      mergeRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mergeRef.current) return;
    const mv = mergeRef.current;

    const aDoc = mv.a.state.doc.toString();
    if (aDoc !== original) {
      mv.a.dispatch({
        changes: { from: 0, to: aDoc.length, insert: original },
      });
    }

    const bDoc = mv.b.state.doc.toString();
    if (bDoc !== formatted) {
      mv.b.dispatch({
        changes: { from: 0, to: bDoc.length, insert: formatted },
      });
    }
  }, [original, formatted]);

  return (
    <Box
      ref={containerRef}
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
        "& .cm-mergeView": {
          height: "100%",
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    />
  );
}
