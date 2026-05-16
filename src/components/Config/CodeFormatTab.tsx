import {
  Box, Typography, Switch, Button, Paper, TextField, Select, MenuItem,
  FormControl, InputLabel, Divider,
} from "@mui/material";
import { RestartAlt as ResetIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";

const BASE_STYLES = ["LLVM", "Google", "Chromium", "Mozilla", "WebKit", "Microsoft", "GNU"];
const BRACE_STYLES = ["Attach", "Linux", "Mozilla", "Stroustrup", "Allman", "Whitesmiths", "GNU", "WebKit", "Custom"];
const POINTER_ALIGN = ["Left", "Right", "Middle"];
const PP_DIRECTIVES = ["None", "AfterHash", "BeforeHash"];
const CONSTRUCTOR_INIT = ["BeforeColon", "BeforeComma", "AfterColon"];
const INCLUDE_BLOCKS = ["Preserve", "Merge", "Regroup"];

export default function CodeFormatTab() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppContext();
  const c = state.clangFormat;

  const set = (patch: Record<string, unknown>) =>
    dispatch({ type: "SET_CLANG_CONFIG", payload: patch });

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>{t("config.tabs.code")}</Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">{c.enabled ? t("config.clang.on") : t("config.clang.off")}</Typography>
          <Switch checked={c.enabled} onChange={(_, v) => dispatch({ type: "SET_CLANG_ENABLED", payload: v })} />
          <Button variant="outlined" startIcon={<ResetIcon />} size="small"
            onClick={() => dispatch({ type: "RESET_CLANG_CONFIG" })} sx={{ borderRadius: "8px" }}>
            {t("config.reset")}
          </Button>
        </Box>
      </Box>

      {!c.enabled && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: "12px", textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">{t("config.clang.disabledHint")}</Typography>
        </Paper>
      )}

      {c.enabled && (
        <>
          <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "12px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>{t("config.clang.useCustom")}</Typography>
                <Typography variant="caption" color="text.secondary">{t("config.clang.useCustomDesc")}</Typography>
              </Box>
              <Switch checked={c.useCustomConfig} onChange={(_, v) => set({ useCustomConfig: v })} />
            </Box>
            {c.useCustomConfig && (
              <TextField multiline minRows={8} maxRows={20} fullWidth size="small"
                placeholder="BasedOnStyle: LLVM\nIndentWidth: 4"
                value={c.customConfig}
                onChange={(e) => dispatch({ type: "SET_CLANG_CUSTOM_CONFIG", payload: e.target.value })}
                sx={{ mt: 2, fontFamily: "monospace", "& textarea": { fontSize: 13 } }} />
            )}
          </Paper>

          {!c.useCustomConfig && (
            <>
              <Section title={t("config.clang.general")}>
                <Grid>
                  <SelectField label={t("config.clang.basedOnStyle")} value={c.basedOnStyle}
                    onChange={(v) => set({ basedOnStyle: v })} options={BASE_STYLES} />
                  <SelectField label={t("config.clang.breakBeforeBraces")} value={c.breakBeforeBraces}
                    onChange={(v) => set({ breakBeforeBraces: v })} options={BRACE_STYLES} />
                  <NumberField label={t("config.clang.indentWidth")} value={c.indentWidth} min={1} max={16}
                    onChange={(v) => set({ indentWidth: v })} />
                  <NumberField label={t("config.clang.tabWidth")} value={c.tabWidth} min={1} max={16}
                    onChange={(v) => set({ tabWidth: v })} />
                  <NumberField label={t("config.clang.columnLimit")} value={c.columnLimit} min={40} max={300}
                    onChange={(v) => set({ columnLimit: v })} />
                  <SelectField label={t("config.clang.pointerAlignment")} value={c.pointerAlignment}
                    onChange={(v) => set({ pointerAlignment: v })} options={POINTER_ALIGN} />
                  <SwitchField label={t("config.clang.useTab")} checked={c.useTab}
                    onChange={(v) => set({ useTab: v })} />
                  <SwitchField label={t("config.clang.spaceBeforeParens")} checked={c.spaceBeforeParens}
                    onChange={(v) => set({ spaceBeforeParens: v })} />
                </Grid>
              </Section>

              <Section title={t("config.clang.languages")}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                  {t("config.clang.languagesHint")}
                </Typography>
                <TextField size="small" fullWidth multiline minRows={1} maxRows={3}
                  value={c.customLanguages}
                  onChange={(e) => set({ customLanguages: e.target.value })}
                  sx={{ "& textarea": { fontSize: 13, fontFamily: "monospace" } }} />
              </Section>

              <Section title={t("config.clang.alignment")}>
                <Grid>
                  <SwitchField label={t("config.clang.alignConsecutiveAssignments")} checked={c.alignConsecutiveAssignments}
                    onChange={(v) => set({ alignConsecutiveAssignments: v })} />
                  <SwitchField label={t("config.clang.alignConsecutiveDeclarations")} checked={c.alignConsecutiveDeclarations}
                    onChange={(v) => set({ alignConsecutiveDeclarations: v })} />
                  <SwitchField label={t("config.clang.alignTrailingComments")} checked={c.alignTrailingComments}
                    onChange={(v) => set({ alignTrailingComments: v })} />
                </Grid>
              </Section>

              <Section title={t("config.clang.shortLines")}>
                <Grid>
                  <SwitchField label={t("config.clang.allowShortBlocks")} checked={c.allowShortBlocks}
                    onChange={(v) => set({ allowShortBlocks: v })} />
                  <SwitchField label={t("config.clang.allowShortIf")} checked={c.allowShortIf}
                    onChange={(v) => set({ allowShortIf: v })} />
                  <SwitchField label={t("config.clang.allowShortLoops")} checked={c.allowShortLoops}
                    onChange={(v) => set({ allowShortLoops: v })} />
                </Grid>
              </Section>

              <Section title={t("config.clang.wrapping")}>
                <Grid>
                  <SwitchField label={t("config.clang.binPackArgs")} checked={c.binPackArgs}
                    onChange={(v) => set({ binPackArgs: v })} />
                  <SwitchField label={t("config.clang.binPackParams")} checked={c.binPackParams}
                    onChange={(v) => set({ binPackParams: v })} />
                  <SwitchField label={t("config.clang.breakTemplateDeclarations")} checked={c.breakTemplateDeclarations}
                    onChange={(v) => set({ breakTemplateDeclarations: v })} />
                  <SwitchField label={t("config.clang.breakBeforeBinaryOps")} checked={c.breakBeforeBinaryOps}
                    onChange={(v) => set({ breakBeforeBinaryOps: v })} />
                  <SelectField label={t("config.clang.breakConstructorInitializers")} value={c.breakConstructorInitializers}
                    onChange={(v) => set({ breakConstructorInitializers: v })} options={CONSTRUCTOR_INIT} />
                  <NumberField label={t("config.clang.constructorInitializerIndent")} value={c.constructorInitializerIndent} min={0} max={16}
                    onChange={(v) => set({ constructorInitializerIndent: v })} />
                  <NumberField label={t("config.clang.continuationIndentWidth")} value={c.continuationIndentWidth} min={0} max={16}
                    onChange={(v) => set({ continuationIndentWidth: v })} />
                </Grid>
              </Section>

              <Section title={t("config.clang.spacing")}>
                <Grid>
                  <SwitchField label={t("config.clang.spacesInAngles")} checked={c.spacesInAngles}
                    onChange={(v) => set({ spacesInAngles: v })} />
                  <SwitchField label={t("config.clang.spacesInParens")} checked={c.spacesInParens}
                    onChange={(v) => set({ spacesInParens: v })} />
                  <SwitchField label={t("config.clang.spacesInBrackets")} checked={c.spacesInBrackets}
                    onChange={(v) => set({ spacesInBrackets: v })} />
                  <NumberField label={t("config.clang.maxEmptyLines")} value={c.maxEmptyLines} min={0} max={10}
                    onChange={(v) => set({ maxEmptyLines: v })} />
                </Grid>
              </Section>

              <Section title={t("config.clang.other")}>
                <Grid>
                  <SwitchField label={t("config.clang.indentCaseLabels")} checked={c.indentCaseLabels}
                    onChange={(v) => set({ indentCaseLabels: v })} />
                  <SelectField label={t("config.clang.indentPPDirectives")} value={c.indentPPDirectives}
                    onChange={(v) => set({ indentPPDirectives: v })} options={PP_DIRECTIVES} />
                  <SwitchField label={t("config.clang.sortIncludes")} checked={c.sortIncludes}
                    onChange={(v) => set({ sortIncludes: v })} />
                  <SwitchField label={t("config.clang.cpp11BracedListStyle")} checked={c.cpp11BracedListStyle}
                    onChange={(v) => set({ cpp11BracedListStyle: v })} />
                  <SelectField label={t("config.clang.includeBlocks")} value={c.includeBlocks}
                    onChange={(v) => set({ includeBlocks: v })} options={INCLUDE_BLOCKS} />
                </Grid>
              </Section>
            </>
          )}

          <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px" }}>
            <Typography variant="caption" color="text.secondary">{t("config.clang.note")}</Typography>
          </Paper>
        </>
      )}
    </>
  );
}

// ---- mini components ----

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "12px" }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>{title}</Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>{children}</Box>;
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <TextField size="small" type="number" label={label} value={value}
      onChange={(e) => onChange(Math.max(min, Math.min(max, +e.target.value || value)))}
      inputProps={{ min, max }} />
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <FormControl size="small">
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(e) => onChange(e.target.value)}>
        {options.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

function SwitchField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Switch size="small" checked={checked} onChange={(_, v) => onChange(v)} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
