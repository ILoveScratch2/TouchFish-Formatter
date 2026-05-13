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

export interface AppState {
  darkMode: boolean;
  language: string;
  mathRules: Record<string, boolean>;
  fwPunctuation: boolean;
}

export type AppAction =
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "TOGGLE_MATH_RULE"; payload: string }
  | { type: "RESET_RULES" }
  | { type: "SET_FW_PUNCTUATION"; payload: boolean };

export interface Segment {
  type: "text" | "fence" | "inlineCode" | "mathBlock" | "inlineMath";
  content: string;
  wrapper?: {
    before: string;
    after: string;
  };
}
