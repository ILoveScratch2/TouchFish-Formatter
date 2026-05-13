import { IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";

export default function DarkModeSwitcher() {
  const { state, dispatch } = useAppContext();
  const { t } = useTranslation();

  return (
    <IconButton
      onClick={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
      color="inherit"
      title={state.darkMode ? t("common.lightMode") : t("common.darkMode")}
    >
      {state.darkMode ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
