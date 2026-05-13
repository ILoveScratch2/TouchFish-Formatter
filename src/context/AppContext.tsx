import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { AppState, AppAction } from "../types";
import { getDefaultMathRules } from "../engine/rules";
import i18n from "../i18n";

// UI-side default: most rules on, but a few are commonly kept off
// (mirrors the original solfmt-web config store defaults).
function getUiMathDefaults(): Record<string, boolean> {
  const all = { ...getDefaultMathRules() };
  // Disable the more aggressive rules by default in the config page
  all["sym/star-to-times"] = false;
  all["sym/double-equal-to-single"] = false;
  all["syn/array-to-subscript"] = false;
  return all;
}

function loadState(): AppState {
  const stored = localStorage.getItem("touchfish-config");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        darkMode: parsed.darkMode ?? true,
        language: parsed.language ?? "zh-CN",
        mathRules: parsed.mathRules ?? getUiMathDefaults(),
        fwPunctuation: parsed.fwPunctuation ?? true,
      };
    } catch {
      // ignore
    }
  }
  return {
    darkMode: window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true,
    language: "zh-CN",
    mathRules: getUiMathDefaults(),
    fwPunctuation: true,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "TOGGLE_MATH_RULE": {
      const key = action.payload;
      return {
        ...state,
        mathRules: { ...state.mathRules, [key]: !state.mathRules[key] },
      };
    }
    case "SET_FW_PUNCTUATION":
      return { ...state, fwPunctuation: action.payload };
    case "RESET_RULES":
      return { ...state, mathRules: getUiMathDefaults(), fwPunctuation: true };
    default:
      return state;
  }
}

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
