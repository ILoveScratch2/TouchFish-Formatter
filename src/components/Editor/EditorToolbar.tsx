import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AutoFixHigh as FormatIcon,
  ContentCopy as CopyIcon,
  Compare as DiffIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface EditorToolbarProps {
  showDiff: boolean;
  onToggleDiff: () => void;
  onFormat: () => void;
  onCopy: () => void;
  hasInput: boolean;
  formatting?: boolean;
}

export default function EditorToolbar({
  showDiff,
  onToggleDiff,
  onFormat,
  onCopy,
  hasInput,
  formatting,
}: EditorToolbarProps) {
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const handleCopy = async () => {
    onCopy();
    setSnackbar(t("editor.copied"));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
      }}
    >
      <Button
        variant="contained"
        startIcon={<FormatIcon />}
        onClick={onFormat}
        disabled={!hasInput || formatting}
        size="small"
        sx={{ borderRadius: "8px" }}
      >
        {t("editor.format")}
      </Button>

      <Button
        variant="outlined"
        startIcon={<CopyIcon />}
        onClick={handleCopy}
        disabled={!hasInput}
        size="small"
        sx={{ borderRadius: "8px" }}
      >
        {t("editor.copy")}
      </Button>

      <ToggleButtonGroup
        value={showDiff ? "diff" : ""}
        exclusive
        onChange={() => onToggleDiff()}
        size="small"
      >
        <ToggleButton
          value="diff"
          aria-label="toggle diff"
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          <DiffIcon fontSize="small" sx={{ mr: 0.5 }} />
          {showDiff ? t("editor.hideDiff") : t("editor.showDiff")}
        </ToggleButton>
      </ToggleButtonGroup>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: "12px" }}
        >
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
