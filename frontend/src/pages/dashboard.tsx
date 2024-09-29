import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Avatar, Divider, SpeedDialIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getUserProfile, logout } from '../services/authService';
import AvatarInitials from '../components/avatar';
import { addResponseMessage, addUserMessage, Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { getMyMessages, sendMessage } from '../services/apiService';
import eventEmitter from '../services/eventEmitter';
import { CalendarIcon } from '@mui/x-date-pickers';
const drawerWidth = 240;
const userId = Number(localStorage.getItem('userId'))

// Utility function to generate a GUID
const generateGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; // Generate a random number between 0 and 15
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // For 'y', ensure the leading bits are 10
    return v.toString(16);
  });
};

const Dashboard: React.FC = () => {

  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chat, setChat] = useState<any[]>([]);
  const [chatIds, setChatIds] = useState<any[]>([]);
  const [unOpenedMsgs, setUnOpenedMsgs] = useState<any>(null)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getMessages()
  }, []);


  useEffect(() => {
    // fectch chat messages every 8secs
    const intervalId = setInterval(getMessages, 8000);
    // Cleanup function to clear the interval on unmount
    return () => clearInterval(intervalId);
  }, [chat, chatIds]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const profile = getUserProfile();

  const getMessages = async () => {
    try {
      const response = await getMyMessages();
      if (response && response.length > 0) {
        eventEmitter.emit('messagePublished', response);

        const newMsgs = response.filter(c => c.senderId !== userId && !c.isSeen);
        console.log('unread')
        console.log(JSON.stringify(newMsgs))
        const newMsgsCount = response.filter(c => c.senderId !== userId && !c.isSeen)?.length;

        setUnOpenedMsgs(newMsgsCount)
        setChat(response)
        writeResponse(response.reverse())
      }
    } catch (e) {
      console.log(e)
    }
  };


  const handleNewUserMessage = async (newMessage) => {
    const chatId = generateGUID()
    setChatIds((prevArray) => [...prevArray, chatId]);
    await sendMessage({ fromPatient: true, message: newMessage, clientMsgId: chatId })
  };

  const writeResponse = (response: any[]) => {
    const newChat = response.filter(r => !chat.some(c => c.id === r.id))
    newChat.forEach(f => {
      if (f.recipientId === userId) {
        addResponseMessage(f.message);
      } else {
        if (!chatIds.some(c => c === f.clientMessageId))
          addUserMessage(f.message)
      }
    })
  }
  // Drawer content with avatar and menus
  const drawer = (
    <div>
      {/* Avatar */}
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <Avatar
          alt="User Name"
          src={profile?.avatarLink} // Replace with real avatar image
          sx={{ width: 80, height: 80 }}
        />
        {/* <AvatarInitials userName={profile?.name} size={80} /> */}
      </Box>

      <Typography variant="h6" align="center" gutterBottom>
        {profile?.name}
      </Typography>

      <Divider />

      {/* Menu List */}
      <List>
        <ListItem component={Link} to="home">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {profile?.role === 'Admin' &&
          <ListItem component={Link} to="patient">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Patients" />
          </ListItem>
        }
        {(profile?.role === 'Admin' || profile?.role === 'Staff') &&
          <ListItem component={Link} to="chat-view">
            <ListItemIcon>
              <img
                src="/messages.png"
                alt="Messages"
                style={{ width: '28px', height: '28px' }}
              />
            </ListItemIcon>
            <ListItemText primary="Messages" />
            {
              unOpenedMsgs !== null && unOpenedMsgs > 0 && location.pathname !== '/dashboard/chat-view' &&
              <Typography color='error' sx={{ marginRight: '25px', fontStyle: 'bold', fontWeight: 600 }}>({unOpenedMsgs})</Typography>
            }
          </ListItem>
        }
        {(profile?.role === 'Admin' || profile?.role === 'Staff') &&
          <ListItem component={Link} to="questionnaire">
            <ListItemIcon>
              <img
                src="/questionnaire.png"
                alt="Questionnaire"
                style={{ width: '30px', height: '30px' }}
              />
            </ListItemIcon>
            <ListItemText primary="Questionnaire" />
          </ListItem>
        }

        {profile?.role === 'Customer' &&
          <ListItem component={Link} to="questionnaire-user">
            <ListItemIcon>
              <img
                src="/questionnaire.png"
                alt="Questionnaire"
                style={{ width: '30px', height: '30px' }}
              />
            </ListItemIcon>
            <ListItemText primary="Questionnaire" />
          </ListItem>
        }

        {profile?.role === 'Customer' &&
          <ListItem component={Link} to="psych-result">
            <ListItemIcon>
              <img
                src="/report.png"
                alt="Result"
                style={{ width: '25px', height: '25px' }}
              />
            </ListItemIcon>
            <ListItemText primary="Result" />
          </ListItem>
        }


        {profile?.role === 'Admin' &&
          <ListItem component={Link} to="psych-report">
            <ListItemIcon>
              <img
                src="/analytics.png"
                alt="Analytics"
                style={{ width: '25px', height: '25px' }}
              />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        }

        {/* {profile?.role === 'Admin' &&
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
        } */}

        {/* {profile?.role === 'Admin' &&
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
        } */}

        {profile?.role === 'Customer' &&
          <ListItem component={Link} to="calendar">
            <ListItemIcon>
              <CalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments" />
          </ListItem>
        }

        {profile?.role === 'Admin' &&
          <ListItem component={Link} to="admin-calendar">
            <ListItemIcon>
              <CalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Appointment Calendar" />
          </ListItem>
        }

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

        {profile?.role === 'Admin' &&
          <ListItem component={Link} to="users">
            <ListItemIcon>
              <img
                src="/user-management.png"
                alt="User Management"
                style={{ width: '23px', height: '23px' }}
              />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
        }
        {/* Settings */}
        {/* <ListItem>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem> */}

        {/* Logout */}
        <ListItem component={Link} to="/login" onClick={() => logout()}>
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
      {profile?.role === 'Customer' &&
        <Widget
          //handleSubmit={handleSubmitMessage}
          handleNewUserMessage={handleNewUserMessage}
          subtitle="How are you feeling today?" />
      }
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
        {isMobile && (
          <Toolbar>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>

        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
