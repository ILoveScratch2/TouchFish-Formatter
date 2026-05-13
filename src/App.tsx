import { useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import i18n from "./i18n";
import { createAppTheme } from "./theme";
import { AppContextProvider, useAppContext } from "./context/AppContext";
import AppLayout from "./components/Layout/AppLayout";
import EditorPage from "./components/Editor/EditorPage";
import ConfigPage from "./components/Config/ConfigPage";

function ThemedApp() {
  const { state } = useAppContext();
  const theme = useMemo(() => createAppTheme(state.darkMode), [state.darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<EditorPage />} />
            <Route path="config" element={<ConfigPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContextProvider>
        <ThemedApp />
      </AppContextProvider>
    </I18nextProvider>
  );
}
