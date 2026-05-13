import {
  Box,
  Typography,
  Switch,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { RestartAlt as ResetIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";
import { MATH_RULES } from "../../engine/rules";

export default function ConfigPage() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppContext();

  const symbolRules = MATH_RULES.filter((r) => r.group === "sym");
  const functionRules = MATH_RULES.filter((r) => r.group === "fn");
  const syntaxRules = MATH_RULES.filter((r) => r.group === "syn");

  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: "auto",
        p: 3,
        pt: 4,
        overflow: "auto",
        height: "calc(100vh - 48px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("config.title")}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ResetIcon />}
          size="small"
          onClick={() => dispatch({ type: "RESET_RULES" })}
          sx={{ borderRadius: "8px" }}
        >
          {t("config.reset")}
        </Button>
      </Box>

      {/* Punctuation settings */}
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 3, borderRadius: "12px" }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {t("config.punctuation")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="body2">
              {t("config.fwPunctuation")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("config.fwPunctuationDesc")}
            </Typography>
          </Box>
          <Switch
            checked={state.fwPunctuation}
            onChange={(_, checked) =>
              dispatch({ type: "SET_FW_PUNCTUATION", payload: checked })
            }
          />
        </Box>
      </Paper>

      {/* Symbol rules */}
      <RuleGroup
        title={t("config.symbolRules")}
        rules={symbolRules}
        mathRules={state.mathRules}
        onToggle={(id) => dispatch({ type: "TOGGLE_MATH_RULE", payload: id })}
        t={t}
      />

      {/* Function rules */}
      <RuleGroup
        title={t("config.functionRules")}
        rules={functionRules}
        mathRules={state.mathRules}
        onToggle={(id) => dispatch({ type: "TOGGLE_MATH_RULE", payload: id })}
        t={t}
      />

      {/* Syntax rules */}
      <RuleGroup
        title={t("config.syntaxRules")}
        rules={syntaxRules}
        mathRules={state.mathRules}
        onToggle={(id) => dispatch({ type: "TOGGLE_MATH_RULE", payload: id })}
        t={t}
      />
    </Box>
  );
}

function RuleGroup({
  title,
  rules,
  mathRules,
  onToggle,
  t,
}: {
  title: string;
  rules: typeof MATH_RULES;
  mathRules: Record<string, boolean>;
  onToggle: (id: string) => void;
  t: (key: string) => string;
}) {
  if (rules.length === 0) return null;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, mb: 3, borderRadius: "12px" }}
    >
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {rules.map((rule) => (
        <Box
          key={rule.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 0.5,
          }}
        >
          <Typography variant="body2">
            {t(rule.descriptionKey)}
          </Typography>
          <Switch
            checked={mathRules[rule.id] ?? false}
            onChange={() => onToggle(rule.id)}
            size="small"
          />
        </Box>
      ))}
    </Paper>
  );
}
