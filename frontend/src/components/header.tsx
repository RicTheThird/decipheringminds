import React, { Component, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Home from "../pages/home";
import { isAuthenticated, logout } from "../services/authService";

const Headers: React.FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Toggle Drawer
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  // Drawer menu items
  const menuItems = [
    {
      name: "Dashboard",
      route: "/dashboard/home",
      show: isAuthenticated(),
    },
    {
      name: "Home",
      route: "/home",
      show: true,
    },
    {
      name: "Login",
      route: "/login",
      show: !isAuthenticated(),
    },
    {
      name: "Register",
      route: "/register",
      show: !isAuthenticated(),
    },

  ];

  const onMenuClicked = (route: string) => navigate(route);

  const drawerMenu = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <IconButton edge="start" color="inherit" aria-label="logo">
        <img src='/header-logo.png' alt="Logo" style={{ height: '60px' }} /> {/* Adjust height as needed */}
      </IconButton>
      <Divider />
      <List>
        {menuItems.filter(m => m.show).map((m, index) => (
          <ListItem key={index} onClick={() => onMenuClicked(m.route)}>
            <ListItemText primary={m.name} />
          </ListItem>
        ))}
        {isAuthenticated() &&
          <ListItem key={6} onClick={() => { logout(); onMenuClicked("/login") }}>
            <ListItemText primary='Logout' />
          </ListItem>
        }
      </List>
    </Box>
  );

  return (
    <>
      {/* AppBar - Header */}
      <AppBar position="static" sx={{ background: "#F4FEFF" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img src='/header-logo.png' alt="Logo" style={{ height: '60px' }} /> {/* Adjust height as needed */}
          </IconButton>
          <Typography
            className="gradient-text"
            fontWeight="700"
            variant="h5"
            sx={{ flexGrow: 1, ml: '-20px' }}
          >
            DecipheringMinds
          </Typography>

          {/* Desktop Menu (displayed on larger screens) */}
          {!isMobile ? (
            <Box>
              {menuItems.filter(m => m.show && (!['Register', 'Login'].includes(m.name))).map((m, index) => (
                <Button
                  key={index}
                  sx={{ color: "black", fontWeight: "600", ml: 2 }}
                  onClick={() => onMenuClicked(m.route)}
                >
                  {m.name}
                </Button>
              ))}
              {!isAuthenticated() &&
                <>
                  <Button className="gradient-button"
                    sx={{ borderRadius: "20px", color: "white", fontWeight: "600", ml: 2 }}
                    onClick={() => onMenuClicked("/register")} >
                    Register
                  </Button>
                  <Button className="gradient-button"
                    sx={{ borderRadius: "20px", color: "white", fontWeight: "600", ml: 2 }}
                    onClick={() => onMenuClicked("/login")} >
                    Login
                  </Button>
                </>
              }
              {isAuthenticated() &&
                <Button className="gradient-button"
                  sx={{ borderRadius: "20px", color: "white", fontWeight: "600", ml: 2 }}
                  onClick={() => { logout(); onMenuClicked("/login") }} >
                  Logout
                </Button>
              }

            </Box>
          ) : (
            // Hamburger Menu (displayed on mobile screens)
            <>
              <IconButton edge="start" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                sx={{ color: "black" }}
                onClose={toggleDrawer(false)}
              >
                {drawerMenu}
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Headers;
