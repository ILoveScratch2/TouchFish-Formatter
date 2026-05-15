export interface MathRule {
  id: string;
  group: "sym" | "fn" | "syn";
  descriptionKey: string;
  pattern: RegExp;
  replacement: string | ((...args: string[]) => string);
  enabled: boolean;
}

export interface FormatConfig {
  fwPunctuation: boolean;
  mathRules: Record<string, boolean>;
  clangFormat: boolean;
}

export interface ClangFormatConfig {
  enabled: boolean;
  useCustomConfig: boolean;
  customConfig: string;
  basedOnStyle: string;
  indentWidth: number;
  useTab: boolean;
  tabWidth: number;
  columnLimit: number;
  breakBeforeBraces: string;
  pointerAlignment: string;
  spaceBeforeParens: boolean;
  alignConsecutiveAssignments: boolean;
  alignConsecutiveDeclarations: boolean;
  allowShortBlocks: boolean;
  allowShortIf: boolean;
  allowShortLoops: boolean;
  binPackArgs: boolean;
  binPackParams: boolean;
  indentCaseLabels: boolean;
  indentPPDirectives: string;
  maxEmptyLines: number;
  sortIncludes: boolean;
  spacesInAngles: boolean;
  spacesInParens: boolean;
  spacesInBrackets: boolean;
  alignTrailingComments: boolean;
  breakTemplateDeclarations: boolean;
  breakBeforeBinaryOps: boolean;
  breakConstructorInitializers: string;
  constructorInitializerIndent: number;
  continuationIndentWidth: number;
  includeBlocks: string;
  cpp11BracedListStyle: boolean;
}

export type AppAction =
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "TOGGLE_MATH_RULE"; payload: string }
  | { type: "RESET_RULES" }
  | { type: "SET_FW_PUNCTUATION"; payload: boolean }
  | { type: "SET_CLANG_ENABLED"; payload: boolean }
  | { type: "SET_CLANG_CONFIG"; payload: Partial<ClangFormatConfig> }
  | { type: "SET_CLANG_CUSTOM_CONFIG"; payload: string }
  | { type: "RESET_CLANG_CONFIG" };

export interface AppState {
  darkMode: boolean;
  language: string;
  mathRules: Record<string, boolean>;
  fwPunctuation: boolean;
  clangFormat: ClangFormatConfig;
}
