import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { AppState, AppAction, ClangFormatConfig } from "../types";
import { getDefaultMathRules } from "../engine/rules";
import i18n from "../i18n";

// ---- UI-side math defaults (some rules off by default) ----

function getUiMathDefaults(): Record<string, boolean> {
  const all = { ...getDefaultMathRules() };
  all["sym/star-to-times"] = false;
  all["sym/double-equal-to-single"] = false;
  all["syn/array-to-subscript"] = false;
  return all;
}

// ---- Clang-format defaults ----

function getDefaultClangConfig(): ClangFormatConfig {
  return {
    enabled: false,
    useCustomConfig: false,
    customConfig: "",
    basedOnStyle: "LLVM",
    indentWidth: 4,
    useTab: false,
    tabWidth: 4,
    columnLimit: 120,
    breakBeforeBraces: "Attach",
    pointerAlignment: "Right",
    spaceBeforeParens: false,
    alignConsecutiveAssignments: false,
    alignConsecutiveDeclarations: false,
    allowShortBlocks: true,
    allowShortIf: true,
    allowShortLoops: false,
    binPackArgs: true,
    binPackParams: true,
    indentCaseLabels: false,
    indentPPDirectives: "None",
    maxEmptyLines: 1,
    sortIncludes: false,
    spacesInAngles: false,
    spacesInParens: false,
    spacesInBrackets: false,
    alignTrailingComments: false,
    breakTemplateDeclarations: false,
    breakBeforeBinaryOps: false,
    breakConstructorInitializers: "BeforeColon",
    constructorInitializerIndent: 4,
    continuationIndentWidth: 4,
    includeBlocks: "Preserve",
    cpp11BracedListStyle: false,
    customLanguages: "c, cc, cpp, c++, cxx, h, hh, hpp, h++, hxx, inc, inl",
  };
}

// ---- State loader ----

function loadState(): AppState {
  const base = {
    darkMode: window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true,
    language: "zh-CN" as string,
    mathRules: getUiMathDefaults(),
    fwPunctuation: true,
    normalizeMathSpaces: true,
    ellipsisToFw: true,
    removeDuplicateBlankLines: false,
    clangFormat: getDefaultClangConfig(),
  };

  const stored = localStorage.getItem("touchfish-config");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        darkMode: parsed.darkMode ?? base.darkMode,
        language: parsed.language ?? base.language,
        mathRules: parsed.mathRules ?? base.mathRules,
        fwPunctuation: parsed.fwPunctuation ?? base.fwPunctuation,
        normalizeMathSpaces: parsed.normalizeMathSpaces ?? base.normalizeMathSpaces,
        ellipsisToFw: parsed.ellipsisToFw ?? base.ellipsisToFw,
        removeDuplicateBlankLines: parsed.removeDuplicateBlankLines ?? base.removeDuplicateBlankLines,
        clangFormat: parsed.clangFormat
          ? { ...base.clangFormat, ...parsed.clangFormat }
          : base.clangFormat,
      };
    } catch { /* ignore */ }
  }
  return base;
}

// ---- Reducer ----

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "TOGGLE_MATH_RULE":
      return {
        ...state,
        mathRules: { ...state.mathRules, [action.payload]: !state.mathRules[action.payload] },
      };
    case "SET_FW_PUNCTUATION":
      return { ...state, fwPunctuation: action.payload };
    case "SET_NORMALIZE_MATH_SPACES":
      return { ...state, normalizeMathSpaces: action.payload };
    case "SET_ELLIPSIS_TO_FW":
      return { ...state, ellipsisToFw: action.payload };
    case "SET_REMOVE_DUPLICATE_BLANK_LINES":
      return { ...state, removeDuplicateBlankLines: action.payload };
    case "RESET_RULES":
      return { ...state, mathRules: getUiMathDefaults(), fwPunctuation: true, normalizeMathSpaces: true, ellipsisToFw: true, removeDuplicateBlankLines: false };
    case "SET_CLANG_ENABLED":
      return { ...state, clangFormat: { ...state.clangFormat, enabled: action.payload } };
    case "SET_CLANG_CONFIG":
      return { ...state, clangFormat: { ...state.clangFormat, ...action.payload } };
    case "SET_CLANG_CUSTOM_CONFIG":
      return { ...state, clangFormat: { ...state.clangFormat, customConfig: action.payload } };
    case "RESET_CLANG_CONFIG":
      return { ...state, clangFormat: getDefaultClangConfig() };
    default:
      return state;
  }
}

// ---- Context ----

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    localStorage.setItem("touchfish-config", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    i18n.changeLanguage(state.language);
  }, [state.language]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
}
