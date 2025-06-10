import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import backgroundImage from '../assets/background.jpg';

/**
 * A direct background image component that uses a more reliable approach
 * This can be used as an alternative to BackgroundWrapper when more reliability is needed
 */
const BackgroundImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Log component render
  console.log('BackgroundImage component rendering');
  console.log('Background image path:', backgroundImage);
  
  // Preload the background image to ensure it's available
  useEffect(() => {
    console.log('BackgroundImage useEffect running');
    
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
      setImageError(true);
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

  // Create direct inline style to ensure the image is applied
  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Create a second background element with another approach for maximum reliability
  return (
    <>
      {/* Primary background approach */}
      <Box
        style={style}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage}) !important`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,
          zIndex: -1,
          filter: 'contrast(1.2) brightness(0.9) saturate(1.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 128, 0.05)',
            pointerEvents: 'none',
          },
        }}
      />
      
      {/* Fallback DIV with image as a background */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,
          filter: 'contrast(1.2) brightness(0.9) saturate(1.1)',
        }}
      />
      
      {/* Loading indicator (hidden once loaded) */}
      {!imageLoaded && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: 2,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
          <Box mt={2}>Loading background...</Box>
        </Box>
      )}
      
      {/* Error message (only shown if there's an error) */}
      {imageError && (
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20,
            zIndex: 9999,
            backgroundColor: 'rgba(255,0,0,0.1)',
            color: 'red',
            padding: 1,
            borderRadius: 1,
            fontSize: '12px',
          }}
        >
          Background image failed to load
        </Box>
      )}
    </>
  );
};

export default BackgroundImage; 