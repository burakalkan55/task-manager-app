import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import TaskIcon from "@mui/icons-material/Task";

const drawerWidth = 240;

const MainLayout = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Görev Paneli
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton onClick={() => handleNavigation("/dashboard")}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("/tasks")}>
              <ListItemIcon><TaskIcon /></ListItemIcon>
              <ListItemText primary="Görevler" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("/settings")}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Ayarlar" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("/")}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Çıkış Yap" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
