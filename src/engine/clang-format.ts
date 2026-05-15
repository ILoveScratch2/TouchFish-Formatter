import type { ClangFormatConfig } from "../types";

let _initialized = false;
let _ClangFormat: (new () => { with_style(s: string): void; format(code: string, filename: string): string }) | null = null;

function buildStyle(config: ClangFormatConfig): string {
  if (config.useCustomConfig) return config.customConfig;

  const m: Record<string, string | number | boolean> = {
    BasedOnStyle: config.basedOnStyle,
    IndentWidth: config.indentWidth,
    UseTab: config.useTab ? "Always" : "Never",
    TabWidth: config.tabWidth,
    ColumnLimit: config.columnLimit,
  };

  if (config.breakBeforeBraces !== "Custom") {
    m.BreakBeforeBraces = config.breakBeforeBraces;
  }
  m.PointerAlignment = config.pointerAlignment;
  m.AlignConsecutiveAssignments = config.alignConsecutiveAssignments ? "AcrossEmptyLinesAndComments" : "None";
  m.AlignConsecutiveDeclarations = config.alignConsecutiveDeclarations ? "AcrossEmptyLinesAndComments" : "None";
  m.AllowShortBlocksOnASingleLine = config.allowShortBlocks ? "Always" : "Never";
  m.AllowShortIfStatementsOnASingleLine = config.allowShortIf ? "Always" : "Never";
  m.AllowShortLoopsOnASingleLine = config.allowShortLoops ? "true" : "false";
  m.BinPackArguments = config.binPackArgs;
  m.BinPackParameters = config.binPackParams;
  m.IndentCaseLabels = config.indentCaseLabels;
  m.IndentPPDirectives = config.indentPPDirectives;
  m.MaxEmptyLinesToKeep = config.maxEmptyLines;
  m.SortIncludes = config.sortIncludes ? "CaseSensitive" : "Never";
  m.SpaceBeforeParens = config.spaceBeforeParens ? "ControlStatements" : "Never";
  m.SpacesInAngles = config.spacesInAngles ? "Always" : "Never";
  m.SpacesInParens = config.spacesInParens ? "Custom" : "Never";
  m.SpacesInSquareBrackets = config.spacesInBrackets ? "true" : "false";
  m.AlignTrailingComments = config.alignTrailingComments;
  m.AlwaysBreakTemplateDeclarations = config.breakTemplateDeclarations ? "Yes" : "No";
  m.BreakBeforeBinaryOperators = config.breakBeforeBinaryOps ? "All" : "None";
  m.BreakConstructorInitializers = config.breakConstructorInitializers;
  m.ConstructorInitializerIndentWidth = config.constructorInitializerIndent;
  m.ContinuationIndentWidth = config.continuationIndentWidth;
  m.IncludeBlocks = config.includeBlocks;
  m.Cpp11BracedListStyle = config.cpp11BracedListStyle;

  // Build valid YAML (block-style, one line per key)
  return Object.entries(m).map(([k, v]) => `${k}: ${v}`).join("\n");
}

async function initWasm(): Promise<boolean> {
  if (_initialized) return true;
  try {
    const m = await import("@wasm-fmt/clang-format/vite");
    const initFn = (m as Record<string, unknown>).default as (() => Promise<void>) | undefined;
    if (initFn) await initFn();
    _ClangFormat = (m as { ClangFormat: typeof _ClangFormat }).ClangFormat;
    _initialized = true;
    return true;
  } catch {
    return false;
  }
}

export async function formatCode(code: string, config: ClangFormatConfig): Promise<string> {
  if (!config.enabled) return code;

  const ok = await initWasm();
  if (!ok || !_ClangFormat) return code;

  try {
    const fmt = new _ClangFormat();
    fmt.with_style(buildStyle(config));
    return fmt.format(code, "file.cpp");
  } catch {
    return code;
  }
}
