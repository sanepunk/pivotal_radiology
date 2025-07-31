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

  // Use the imported image directly - this is the most reliable approach with Vite
  const directBackgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    zIndex: -1, // Make sure this is below the content and footer
    filter: 'contrast(1.2) brightness(0.9) saturate(1.1)',
  };

  return (
    <Box sx={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      flexGrow: 1, // Take available space, but allow footer to be visible
    }}>
      {/* Direct background element using imported image */}
      <div style={directBackgroundStyle}></div>
      
      {/* Content container that keeps content above background */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
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