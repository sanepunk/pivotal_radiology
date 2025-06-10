import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper
} from '@mui/material';
import { useState } from 'react';
import Header from './Header';

function Layout({ children }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      position: 'relative',
      zIndex: 1,
      width: '100%',
    }}>
      <Header />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 0, 
          px: 0,
          margin: 0,
          padding: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          marginBottom: 0,
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
          width: '100%',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          Software is for binary TB detection only (colour-coded by severity).
          Confirm with a physician.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          © 2025 PIVOTAL TELERADIOLOGY LLP. All rights reserved.
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