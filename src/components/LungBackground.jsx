import { Box } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import lungImage from '../assets/background.jpg';

// The background lung image
const LungBackground = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Skip background for landing page, report page, and PDF page
  const excludedPaths = ['/', '/report', '/pdf'];
  const shouldShowBackground = !excludedPaths.some(excludedPath => 
    path === excludedPath || path === excludedPath + '/'
  );

  // For debugging - log path and whether background should show
  console.log('Current path:', path);
  console.log('Should show background:', shouldShowBackground);

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      width: '100%'
    }}>
      {shouldShowBackground && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${lungImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default LungBackground; 