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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Home from "../pages/home";

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
  const menuItems1 = ["Dashboard", "Home", "Services", "About Us", "Contact"];
  const menuItems = [
    {
      name: "Dashboard",
      component: Dashboard,
      route: "/dashboard",
    },
    {
      name: "Home",
      component: Home,
      route: "/home",
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
      <List>
        {menuItems.map((m, index) => (
          <ListItem key={index} onClick={() => onMenuClicked(m.route)}>
            <ListItemText primary={m.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* AppBar - Header */}
      <AppBar position="static" sx={{ background: "#F4FEFF" }}>
        <Toolbar>
          {/* Logo */}
          <Typography
            className="gradient-text"
            fontWeight="700"
            variant="h5"
            sx={{ flexGrow: 1 }}
          >
            DecipheringMinds
          </Typography>

          {/* Desktop Menu (displayed on larger screens) */}
          {!isMobile ? (
            <Box>
              {menuItems.map((m, index) => (
                <Button
                  key={index}
                  sx={{ color: "black", fontWeight: "600", ml: 2 }}
                  onClick={() => onMenuClicked(m.route)}
                >
                  {m.name}
                </Button>
              ))}

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
