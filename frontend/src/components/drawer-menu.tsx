// src/components/DrawerMenu.tsx
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';


const DrawerMenu: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Responsive App</Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={toggleDrawer}>
        <List>
          <ListItem component={Link} to="/" onClick={toggleDrawer}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem component={Link} to="/home" onClick={toggleDrawer}>
            <ListItemText primary="Home" />
          </ListItem>
        </List>
      </Drawer>

    </div>
  );
};

export default DrawerMenu;
