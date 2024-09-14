import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Avatar, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer content with avatar and menus
  const drawer = (
    <div>
      {/* Avatar */}
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <Avatar
          alt="User Name"
          src="/dashboard-avatar.png" // Replace with real avatar image
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      <Typography variant="h6" align="center" gutterBottom>
        Ric Ferrancullo
      </Typography>

      <Divider />

      {/* Menu List */}
      <List>
        {/* Dashboard */}
        <ListItem component={Link} to="home">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Home */}
        <ListItem component={Link} to="questionnaire">
          <ListItemIcon>
          <img
            src="/questionnaire.png"
            alt="Questionnaire"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
          />
          </ListItemIcon>
          <ListItemText primary="Questionnaire" />
        </ListItem>

        <ListItem component={Link} to="psych-report">
          <ListItemIcon>
          <img
            src="/psych.png"
            alt="Pysch Report"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
          />
          </ListItemIcon>
          <ListItemText primary="Pysch Report" />
        </ListItem>

        <ListItem component={Link} to="diagnostic">
          <ListItemIcon>
          <img
            src="/diagnostic.png"
            alt="Diagnostic"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
          />
          </ListItemIcon>
          <ListItemText primary="Diagnostic" />
        </ListItem>

        <ListItem>
          <ListItemIcon>
          <img
            src="/intervention.png"
            alt="Intervention"
            style={{ width: '25px', height: '25px', borderRadius: '50%' }} 
          />
          </ListItemIcon>
          <ListItemText primary="Intervention" />
        </ListItem>

        <ListItem component={Link} to="calendar">
          <ListItemIcon>
          <img
            src="/calendar.png"
            alt="Calendar"
            style={{ width: '25px', height: '25px', borderRadius: '50%' }} 
          />
          </ListItemIcon>
          <ListItemText primary="Book Appointment" />
        </ListItem>

        <Divider />
        <ListItem component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {/* Account */}
        <ListItem component={Link} to="profile">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>

        {/* Settings */}
        <ListItem>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>

        {/* Logout */}
        <ListItem component={Link} to="/login">
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <CssBaseline /> */}

      {/* AppBar for the top toolbar */}
      {/* <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar> 
      */}

      {/* Drawer for side navigation */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar>
        {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          </Toolbar>
         <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
