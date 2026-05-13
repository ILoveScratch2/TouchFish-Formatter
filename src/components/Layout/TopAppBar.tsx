import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import DarkModeSwitcher from "../Common/DarkModeSwitcher";
import LanguageSwitcher from "../Common/LanguageSwitcher";

interface TopAppBarProps {
  onToggleDrawer: () => void;
}

export default function TopAppBar({ onToggleDrawer }: TopAppBarProps) {
  const { t } = useTranslation();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
      color="inherit"
    >
      <Toolbar variant="dense" sx={{ px: 1, gap: 1 }}>
        <IconButton
          edge="start"
          onClick={onToggleDrawer}
          sx={{ mr: 0.5 }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          sx={{
            flexGrow: 1,
            fontSize: "1.1rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {t("app.title")}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LanguageSwitcher />
          <DarkModeSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
