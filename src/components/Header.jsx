import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Home,
  MenuOpen,
  DarkMode,
  LightMode,
  Logout,
  ContactSupport,
} from '@mui/icons-material';
import { authAPI } from '../services/api';

/**
 * Header component for the TB Screening System
 * Includes navigation, menu, and theme toggle
 */
const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    // Clear authentication data
    authAPI.logout();
    // Navigate to landing page
    window.location.href = '/app/';
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Theme change logic here
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={4}
      sx={{ 
        zIndex: 1300, // Ensure it's above all other content
        marginTop: 0,
        borderRadius: 0,
        top: 0,
        left: 0,
        right: 0,
        padding: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Menu">
            <IconButton 
              color="inherit" 
              onClick={handleMenuOpen}
              sx={{ 
                mr: 2,
                color: 'white', 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                } 
              }}
            >
              <MenuOpen />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 200,
                mt: 1,
              }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/welcome'); }}>
              <ListItemIcon>
                <Home fontSize="small" />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); /* Contact us action */ }}>
              <ListItemIcon>
                <ContactSupport fontSize="small" />
              </ListItemIcon>
              <ListItemText>Contact Support</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>

          <Tooltip title="Home">
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/welcome')}
              sx={{ 
                color: 'white', 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                } 
              }}
            >
              <Home />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography
          variant="h6"
          component="div"
          sx={{ 
            fontWeight: 700,
            fontSize: '24px',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px',
          }}
        >
          TB Screening System
        </Typography>

        <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            edge="end"
            sx={{ 
              color: 'white', 
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              } 
            }}
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 