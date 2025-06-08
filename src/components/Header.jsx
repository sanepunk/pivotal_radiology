import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Logout,
  ContactSupport,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { authAPI } from '../services/api';

/**
 * Header component for the TB Screening System
 * Includes navigation, menu, and back/forward navigation
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
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
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Menu">
            <IconButton 
              color="inherit" 
              onClick={handleMenuOpen}
              sx={{ 
                mr: 1,
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
                mr: 1,
                color: 'white', 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                } 
              }}
            >
              <Home />
            </IconButton>
          </Tooltip>

          <Tooltip title="Go Back">
            <IconButton 
              color="inherit" 
              onClick={handleGoBack}
              sx={{ 
                mr: 1,
                color: 'white', 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                } 
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>

          <Tooltip title="Go Forward">
            <IconButton 
              color="inherit" 
              onClick={handleGoForward}
              sx={{ 
                color: 'white', 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                } 
              }}
            >
              <ArrowForward />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Centered Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            fontSize: '24px',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px',
            textAlign: 'center',
          }}
        >
          TB Screening System
        </Typography>

        {/* Empty box to balance the layout */}
        <Box sx={{ display: 'flex', visibility: 'hidden' }}>
          <IconButton sx={{ width: 40 }}><MenuOpen /></IconButton>
          <IconButton sx={{ width: 40 }}><Home /></IconButton>
          <IconButton sx={{ width: 40 }}><ArrowBack /></IconButton>
          <IconButton sx={{ width: 40 }}><ArrowForward /></IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 