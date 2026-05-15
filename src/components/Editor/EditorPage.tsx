import { useState, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MarkdownEditor from "./MarkdownEditor";
import DiffView from "./DiffView";
import EditorToolbar from "./EditorToolbar";
import { formatSolution, formatSolutionAsync } from "../../engine";
import { useAppContext } from "../../context/AppContext";

export default function EditorPage() {
  const { t } = useTranslation();
  const { state } = useAppContext();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const originalRef = useRef("");

  const doFormat = useCallback(
    async (source: string) => {
      if (state.clangFormat.enabled) {
        return formatSolutionAsync(source, { fwPunctuation: state.fwPunctuation, mathRules: state.mathRules, clangFormat: state.clangFormat.enabled }, state.clangFormat);
      }
      return formatSolution(source, { fwPunctuation: state.fwPunctuation, mathRules: state.mathRules, clangFormat: state.clangFormat.enabled });
    },
    [state.fwPunctuation, state.mathRules, state.clangFormat]
  );

  const handleFormat = useCallback(async () => {
    originalRef.current = input;
    setFormatting(true);
    const formatted = await doFormat(input);
    setFormatting(false);
    setOutput(formatted);
    setInput(formatted);
  }, [input, doFormat]);

  const handleCopy = useCallback(async () => {
    const formatted = output || await doFormat(input);
    if (!output) {
      originalRef.current = input;
      setOutput(formatted);
    }
    try {
      await navigator.clipboard.writeText(formatted);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = formatted;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }, [input, output, doFormat]);

  const handleToggleDiff = useCallback(async () => {
    if (!showDiff) {
      originalRef.current = input;
      setFormatting(true);
      const formatted = await doFormat(input);
      setFormatting(false);
      setOutput(formatted);
    }
    setShowDiff(!showDiff);
  }, [showDiff, input, doFormat]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)", overflow: "hidden" }}>
      <EditorToolbar
        showDiff={showDiff}
        onToggleDiff={handleToggleDiff}
        onFormat={handleFormat}
        onCopy={handleCopy}
        hasInput={input.length > 0}
        formatting={formatting}
      />

      {showDiff ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, gap: 1, minHeight: 0 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="caption" sx={{ flex: 1, fontWeight: 600, color: "text.secondary" }}>{t("editor.original")}</Typography>
            <Typography variant="caption" sx={{ flex: 1, fontWeight: 600, color: "text.secondary" }}>{t("editor.formatted")}</Typography>
          </Box>
          <DiffView original={originalRef.current} formatted={output} darkMode={state.darkMode} />
        </Box>
      ) : (
        <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <MarkdownEditor value={input} onChange={setInput} darkMode={state.darkMode} />
        </Box>
      )}
    </Box>
  );
}
