import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ChatIcon from '@mui/icons-material/Chat';
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getDashboardRouteByRole } from "../../utils/getNavigationByRole";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Why choose us", id: "whychooseus" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const { theme, toggleTheme } = useTheme();


  return (
    <>
      <AppBar 
        position="fixed"
        className={`navbar-glass-overlay ${scrolled ? 'scrolled' : ''}`}
        sx={{ 
          backgroundColor: scrolled 
            ? (theme === 'light' ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.85)") 
            : (theme === 'light' ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)"),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", 
          borderBottom: scrolled 
            ? (theme === 'light' ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.2)")
            : (theme === 'light' ? "1px solid rgba(0, 0, 0, 0.05)" : "1px solid rgba(255, 255, 255, 0.1)"),
          boxShadow: scrolled 
            ? (theme === 'light' ? "0 8px 32px rgba(0, 0, 0, 0.1)" : "0 8px 32px rgba(0, 0, 0, 0.3)")
            : (theme === 'light' ? "0 4px 30px rgba(0, 0, 0, 0.05)" : "0 4px 30px rgba(0, 0, 0, 0.1)"),
          transition: "all 0.3s ease",
          top: 0,
          zIndex: 1000
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 }, py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 600, 
              cursor: "pointer",
              color: theme === 'light' ? '#000000' : '#FFFFFF'
            }}
            onClick={() => handleScrollToSection("home")}
          >
            Auto
            <Box component="span" sx={{ color: "var(--color-primary)" }}>
              Care
            </Box>{" "}
            Pro
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
            {navItems.map((item) => (
              <MuiLink
                key={item.label}
                href={`#${item.id}`}
                underline="none"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(item.id);
                }}
                sx={{
                  color: theme === 'light' ? '#000000' : '#FFFFFF',
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  "&:hover": { color: "var(--color-primary)" },
                  transition: "0.2s",
                }}
              >
                {item.label}
              </MuiLink>
            ))}
          </Box>

          {/* Desktop Auth Buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {isAuthenticated ? (
              <>
                {/* My Appointments Button */}
                <Button
                  component={RouterLink as any}
                  to="/dashboard/appointments"
                  startIcon={<EventAvailableIcon sx={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }} />}
                  sx={{
                    color: theme === 'light' ? '#000000' : '#FFFFFF',
                    textTransform: "none",
                    fontSize: "0.9rem",
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "var(--color-primary)",
                      backgroundColor: theme === 'light' ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)"
                    },
                  }}
                >
                  My Appointments
                </Button>

                {/* Dashboard Button */}
                <Button
                  component={RouterLink as any}
                  to="/dashboard"
                  startIcon={<DashboardIcon sx={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }} />}
                  sx={{
                    color: theme === 'light' ? '#000000' : '#FFFFFF',
                    textTransform: "none",
                    fontSize: "0.9rem",
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "var(--color-primary)",
                      backgroundColor: theme === 'light' ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)"
                    },
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  component={RouterLink as any}
                  to="/dashboard/messages"
                  startIcon={<ChatIcon sx={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }} />}
                  sx={{
                    color: "var(--color-text-primary)",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    "&:hover": { color: "var(--color-primary)" },
                  }}
                >
                  Messages
                </Button>

                {/* Logout Button */}
                <Button
                  onClick={logout}
                  startIcon={<LogoutIcon sx={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }} />}
                  variant="outlined"
                  sx={{
                    color: theme === 'light' ? '#000000' : '#FFFFFF',
                    borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                    textTransform: "none",
                    fontSize: "0.9rem",
                    "&:hover": {
                      backgroundColor: theme === 'light' ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
                      borderColor: theme === 'light' ? '#000000' : '#FFFFFF',
                      color: theme === 'light' ? '#000000' : '#FFFFFF'
                    },
                  }}
                >
                  Logout
                </Button>
                {/* Theme toggle button - desktop */}
                <IconButton onClick={toggleTheme} sx={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }} aria-label="toggle theme">
                  {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink as any}
                  to="/login"
                  sx={{
                    color: theme === 'light' ? '#000000' : '#FFFFFF',
                    textTransform: "none",
                    fontSize: "0.9rem",
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "var(--color-primary)",
                      backgroundColor: theme === 'light' ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)"
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink as any}
                  to="/signup"
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                    color: "#FFFFFF",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    py: 1,
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(214, 5, 7, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-hover))",
                      boxShadow: "0 6px 20px rgba(214, 5, 7, 0.4)",
                      transform: "translateY(-2px)"
                    },
                  }}
                >
                  Sign Up
                </Button>
                {/* Theme toggle button - desktop when not authenticated */}
                <IconButton onClick={toggleTheme} sx={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }} aria-label="toggle theme">
                  {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </>
            )}
          </Box>

          {/* Mobile Hamburger Menu */}
          <IconButton
            edge="end"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "block", md: "none" }, color: theme === 'light' ? '#000000' : 'var(--color-text-primary)' }}
          >
            <MenuIcon style={{ color: theme === 'light' ? '#000000' : undefined }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            // Keep drawer dark regardless of app theme
            backgroundColor: '#000000',
            color: '#FFFFFF',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)' }}>
              Auto
              <Box component="span" sx={{ color: "var(--color-primary)" }}>
                Care
              </Box>{" "}
              Pro
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={toggleTheme} sx={{ color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)' }}>
                {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton onClick={toggleDrawer(false)} sx={{ color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)', mb: 2 }} />

          {/* Navigation Items */}
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleScrollToSection(item.id);
                    toggleDrawer(false)();
                  }}
                  sx={{
                    "&:hover": { backgroundColor: "var(--color-hover-bg)" },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "1rem",
                        color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)', my: 2 }} />

          {/* Auth Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
            {isAuthenticated ? (
              <>
                {/* My Appointments Button */}
                <Button
                  component={RouterLink as any}
                  to="/my-appointment"
                  fullWidth
                  onClick={toggleDrawer(false)}
                  sx={{
                    color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)',
                    textTransform: "none",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(214, 5, 7, 0.5)",
                    justifyContent: "flex-start",
                    "&:hover": {
                      backgroundColor: "var(--color-hover-bg)",
                      borderColor: "var(--color-primary)"
                    },
                  }}
                >
                  My Appointments
                </Button>

                {/* Dashboard Button */}
                <Button
                  component={RouterLink as any}
                  to={getDashboardRouteByRole(user?.role || '')}
                  fullWidth
                  onClick={toggleDrawer(false)}
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)',
                    textTransform: "none",
                    fontSize: "0.9rem",
                    border: "1px solid white",
                    justifyContent: "flex-start",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" },
                  }}
                >
                  Dashboard
                </Button>

                {/* Logout Button */}
                <Button
                  fullWidth
                  onClick={() => {
                    logout();
                    toggleDrawer(false)();
                  }}
                  startIcon={<LogoutIcon />}
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--color-primary)",
                    color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)',
                    textTransform: "none",
                    fontWeight: 500,
                    justifyContent: "flex-start",
                    "&:hover": { backgroundColor: "#b00406" },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink as any}
                  to="/login"
                  fullWidth
                  onClick={toggleDrawer(false)}
                  sx={{
                    color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)',
                    textTransform: "none",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(255,255,255,0.12)",
                    "&:hover": { backgroundColor: "var(--color-hover-bg)" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink as any}
                  to="/signup"
                  fullWidth
                  variant="contained"
                  onClick={toggleDrawer(false)}
                  sx={{
                    backgroundColor: "var(--color-primary)",
                    color: theme === 'light' ? '#FFFFFF' : 'var(--color-text-primary)',
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#b00406" },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;