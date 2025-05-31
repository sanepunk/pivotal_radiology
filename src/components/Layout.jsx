import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Help,
  ContactSupport,
  Home,
  ArrowBack,
  ArrowForward,
  Logout,
  Menu as MenuIcon,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useState } from 'react';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
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
    // Add logout logic here
    navigate('/');
  };

  const handleContactUs = () => {
    handleMenuClose();
    // Add contact us navigation logic here
    navigate('/welcome');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You'll need to implement the actual theme change logic here
    // This will depend on your theme implementation
    document.body.style.backgroundColor = isDarkMode ? '#ffffff' : '#121212';
    document.body.style.color = isDarkMode ? '#000000' : '#ffffff';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleContactUs}>
              <ListItemIcon>
                <ContactSupport fontSize="small" />
              </ListItemIcon>
              <ListItemText>Contact Us</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>

          <IconButton
            size="large"
            color="inherit"
            aria-label="home"
            onClick={() => navigate('/welcome')}
          >
            <Home />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center' }}
          >
            TB Screening Portal
          </Typography>

          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ ml: 1 }}
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          Software is for binary TB detection only (colour-coded by severity).
          Confirm with a physician.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          © 2025 Pivotal Teleradiology. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Button color="inherit" size="small">Terms & Conditions</Button>
          {' | '}
          <Button color="inherit" size="small">Privacy Policy</Button>
          {' | '}
          <Button color="inherit" size="small">Disclaimer</Button>
        </Typography>
      </Box>
    </Box>
  );
}

export default Layout; 