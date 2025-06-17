import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {
  Help,
  ContactSupport,
  Home,
  ArrowBack,
  ArrowForward,
  Logout,
} from '@mui/icons-material';
import { authAPI } from '../services/api';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Add logout logic here
    authAPI.logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="help"
            onClick={() => {/* Add help logic */}}
          >
            <Help />
          </IconButton>

          <IconButton
            size="large"
            color="inherit"
            aria-label="contact"
            onClick={() => {/* Add contact logic */}}
          >
            <ContactSupport />
          </IconButton>

          <IconButton
            size="large"
            color="inherit"
            aria-label="home"
            onClick={() => navigate('/welcome')}
          >
            <Home />
          </IconButton>

          <IconButton
            size="large"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>

          <IconButton
            size="large"
            color="inherit"
            aria-label="forward"
            onClick={() => navigate(1)}
          >
            <ArrowForward />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center' }}
          >
            TB Screening Portal
          </Typography>

          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
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