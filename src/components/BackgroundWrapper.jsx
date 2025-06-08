import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import backgroundImage from '../assets/background.jpg';

/**
 * A wrapper component that adds the lung background image
 * with enhanced visibility settings for better display
 */
const BackgroundWrapper = ({ children }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the background image to ensure it's available
  useEffect(() => {
    // Create a new image element to preload the background
    const img = new Image();
    img.src = backgroundImage;
    
    // Set up load handler
    img.onload = () => {
      console.log('Background image loaded successfully');
      setImageLoaded(true);
    };
    
    // Set up error handler
    img.onerror = (err) => {
      console.error('Error loading background image:', err);
      // Still set to loaded to avoid infinite loading state
      setImageLoaded(true);
    };
    
    // Return cleanup function
    return () => {
      // Clean up event handlers
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  // Ensure the background image is applied with inline style as well as sx prop
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      margin: 0, 
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Background Image with improved visibility */}
      <Box
        style={backgroundStyle}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          backgroundImage: `url(${backgroundImage}) !important`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5, // Increased for better visibility
          zIndex: -1, // Keep behind all content
          filter: 'contrast(1.2) brightness(0.9) saturate(1.1)', // Enhanced contrast and saturation
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 128, 0.05)', // Very subtle blue tint
            pointerEvents: 'none',
          }
        }}
      />
      
      {/* Content container that keeps content above background */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        flex: 1,
        width: '100%',
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default BackgroundWrapper; 