import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  EditNote as EditorIcon,
  Tune as ConfigIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const DRAWER_WIDTH = 260;

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function AppDrawer({ open, onClose }: AppDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navItems = [
    { path: "/", label: t("nav.editor"), icon: <EditorIcon /> },
    { path: "/config", label: t("nav.config"), icon: <ConfigIcon /> },
  ];

  const drawerContent = (
    <>
      <Toolbar variant="dense" />
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "text.secondary",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        >
          {t("app.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
          {t("app.subtitle")}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                minHeight: 40,
                "&.Mui-selected": {
                  backgroundColor: (t) =>
                    t.palette.mode === "light"
                      ? `${t.palette.primary.main}18`
                      : `${t.palette.primary.main}30`,
                  "&:hover": {
                    backgroundColor: (t) =>
                      t.palette.mode === "light"
                        ? `${t.palette.primary.main}28`
                        : `${t.palette.primary.main}40`,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <>
      {/* Desktop persistent drawer */}
      {!isMobile && (
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: open ? DRAWER_WIDTH : 0,
            flexShrink: 0,
            whiteSpace: "nowrap",
            transition: (t) =>
              t.transitions.create("width", {
                easing: t.transitions.easing.sharp,
                duration: t.transitions.duration.enteringScreen,
              }),
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              borderRight: "1px solid",
              borderColor: "divider",
              boxSizing: "border-box",
              overflowX: "hidden",
              ...(open
                ? {}
                : {
                    width: 0,
                    border: "none",
                  }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile temporary drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}

export { DRAWER_WIDTH };
