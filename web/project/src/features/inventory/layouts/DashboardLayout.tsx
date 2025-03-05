import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  AppBar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Inventory, Dashboard, People, Logout, Menu, AttachMoney, BarChart } from "@mui/icons-material";
import { useAuthContext } from "../../../core/context/AuthContext";

const drawerWidth = 240;

const DashboardLayout = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const { logout } = useAuthContext();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    { text: "Customers", icon: <People />, path: "/customers" },
    { text: "Sales", icon: <AttachMoney />, path: "/sales" },
    { text: "Reports", icon: <BarChart />, path: "/reports" },
    { text: "Logout", icon: <Logout />, action: handleLogout },
  ];

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: theme.palette.primary.main,
        color: "white",
        height: "100vh",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", mx: "auto" }}>
          Inventory Manager
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={item.path ? Link : "button"}
              to={item.path || undefined}
              onClick={item.action}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.2)" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                color: "white",
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar for mobile */}
      {isMobile && (
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Inventory Manager
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          display: { xs: isMobile ? "block" : "none", md: "block" },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {isMobile && <Toolbar />}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
