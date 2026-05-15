import { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Button,
  Paper,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import {
  RestartAlt as ResetIcon,
  InfoOutlined as AboutIcon,
  Tune as FormatIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";
import { MATH_RULES } from "../../engine/rules";
import CodeFormatTab from "./CodeFormatTab";

const PAGE_WIDTH = 680;

export default function ConfigPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ maxWidth: PAGE_WIDTH, mx: "auto", px: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ "& .MuiTab-root": { textTransform: "none", minHeight: 40 } }}
          >
            <Tab icon={<FormatIcon />} iconPosition="start" label={t("config.tabs.basic")} />
            <Tab icon={<CodeIcon />} iconPosition="start" label={t("config.tabs.code")} />
            <Tab icon={<AboutIcon />} iconPosition="start" label={t("config.tabs.about")} />
          </Tabs>
        </Box>
      </Box>

      {}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          maxWidth: PAGE_WIDTH,
          width: "100%",
          mx: "auto",
          px: 3,
          pt: 3,
          pb: 4,
        }}
      >
        {tab === 0 && <BasicTab />}
        {tab === 1 && <CodeFormatTab />}
        {tab === 2 && <AboutTab />}
      </Box>
    </Box>
  );
}

function BasicTab() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppContext();

  const groups = [
    { key: "sym", title: t("config.symbolRules") },
    { key: "fn", title: t("config.functionRules") },
    { key: "syn", title: t("config.syntaxRules") },
  ];

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>{t("config.title")}</Typography>
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

      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "12px" }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {t("config.punctuation")}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body2">{t("config.fwPunctuation")}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t("config.fwPunctuationDesc")}
            </Typography>
          </Box>
          <Switch
            checked={state.fwPunctuation}
            onChange={(_, checked) => dispatch({ type: "SET_FW_PUNCTUATION", payload: checked })}
          />
        </Box>
      </Paper>

      {groups.map(({ key, title }) => {
        const rules = MATH_RULES.filter((r) => r.group === key);
        if (!rules.length) return null;
        return (
          <Paper key={key} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "12px" }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>{title}</Typography>
            <Divider sx={{ mb: 1 }} />
            {rules.map((rule) => (
              <Box
                key={rule.id}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.5 }}
              >
                <Typography variant="body2">{t(rule.descriptionKey)}</Typography>
                <Switch
                  checked={state.mathRules[rule.id] ?? false}
                  onChange={() => dispatch({ type: "TOGGLE_MATH_RULE", payload: rule.id })}
                  size="small"
                />
              </Box>
            ))}
          </Paper>
        );
      })}
    </>
  );
}

function AboutTab() {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h5" fontWeight={600} gutterBottom>{t("about.title")}</Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: "12px" }}>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{t("about.description")}</Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "12px" }}>
        {[
          [t("about.version"), "1.0.0"],
          [t("about.license"), "MIT"],
          [t("about.author"), t("about.authorDetail")],
        ].map(([label, value], i, arr) => (
          <Box key={label}>
            <Box sx={{ display: "flex", alignItems: "flex-start", py: 0.75, gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 80, color: "text.secondary", flexShrink: 0 }}>
                {label}
              </Typography>
              <Typography variant="body2">{value}</Typography>
            </Box>
            {i < arr.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          p: 2, borderRadius: "12px",
          borderColor: "primary.main",
          bgcolor: (t2) => t2.palette.mode === "light" ? `${t2.palette.primary.main}08` : `${t2.palette.primary.main}12`,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {t("about.thanks")}
        </Typography>
      </Paper>
    </>
  );
}
