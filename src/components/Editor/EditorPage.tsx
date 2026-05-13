import { useState, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MarkdownEditor from "./MarkdownEditor";
import DiffView from "./DiffView";
import EditorToolbar from "./EditorToolbar";
import { formatSolution } from "../../engine";
import { useAppContext } from "../../context/AppContext";

export default function EditorPage() {
  const { t } = useTranslation();
  const { state } = useAppContext();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const originalRef = useRef("");

  const doFormat = useCallback(
    (source: string) => {
      return formatSolution(source, {
        fwPunctuation: state.fwPunctuation,
        mathRules: state.mathRules,
        clangFormat: false,
      });
    },
    [state.fwPunctuation, state.mathRules]
  );

  const handleFormat = useCallback(() => {
    originalRef.current = input;
    const formatted = doFormat(input);
    setOutput(formatted);
    setInput(formatted);
  }, [input, doFormat]);

  const handleCopy = useCallback(async () => {
    const formatted = output || doFormat(input);
    if (!output) {
      originalRef.current = input;
      setOutput(formatted);
    }
    try {
      await navigator.clipboard.writeText(formatted);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = formatted;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }, [input, output, doFormat]);

  const handleToggleDiff = useCallback(() => {
    if (!showDiff) {
      originalRef.current = input;
      const formatted = doFormat(input);
      setOutput(formatted);
    }
    setShowDiff(!showDiff);
  }, [showDiff, input, doFormat]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 48px)",
        overflow: "hidden",
      }}
    >
      <EditorToolbar
        showDiff={showDiff}
        onToggleDiff={handleToggleDiff}
        onFormat={handleFormat}
        onCopy={handleCopy}
        hasInput={input.length > 0}
      />

      {showDiff ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 1,
            minHeight: 0,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              variant="caption"
              sx={{ flex: 1, fontWeight: 600, color: "text.secondary" }}
            >
              {t("editor.original")}
            </Typography>
            <Typography
              variant="caption"
              sx={{ flex: 1, fontWeight: 600, color: "text.secondary" }}
            >
              {t("editor.formatted")}
            </Typography>
          </Box>
          <DiffView
            original={originalRef.current}
            formatted={output}
            darkMode={state.darkMode}
          />
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <MarkdownEditor
            value={input}
            onChange={setInput}
            darkMode={state.darkMode}
          />
        </Box>
      )}
    </Box>
  );
}
