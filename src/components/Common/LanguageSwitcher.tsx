import { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Translate as TranslateIcon, Check as CheckIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";
import { languages } from "../../i18n";

export default function LanguageSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { state, dispatch } = useAppContext();
  const { t } = useTranslation();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (code: string) => {
    dispatch({ type: "SET_LANGUAGE", payload: code });
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit" title={t("common.language")}>
        <TranslateIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} onClick={() => handleSelect(lang.code)}>
            <ListItemText>{lang.displayName}</ListItemText>
            {state.language === lang.code && (
              <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                <CheckIcon fontSize="small" color="primary" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
