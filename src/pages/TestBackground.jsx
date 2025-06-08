import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Grid, Slider, Stack, TextField } from '@mui/material';
import backgroundImage from '../assets/background.jpg';
import MedicalPaper from '../components/MedicalPaper';
import BackgroundImage from '../components/BackgroundImage';

const TestBackground = () => {
  const [opacity, setOpacity] = useState(0.4);
  const [contrast, setContrast] = useState(1.1);
  const [brightness, setBrightness] = useState(0.95);
  
  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      overflow: 'hidden' 
    }}>
      {/* Use the more reliable BackgroundImage component */}
      <BackgroundImage />
      
      {/* Keep the direct background for comparison */}
      <Box
        sx={{
          display: 'none', // Hidden for now, can be enabled for comparison
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: opacity,
          zIndex: 0,
          filter: `contrast(${contrast}) brightness(${brightness})`,
        }}
      />
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <MedicalPaper sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Background Image Test Page (Enhanced Version)
            </Typography>
            <Typography paragraph>
              This page allows you to test different settings for the background image.
              Adjust the sliders below to find the optimal settings for visibility.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2, width: '100%' }}>
              <Grid item xs={12}>
                <Typography id="opacity-slider" gutterBottom>
                  Opacity: {opacity}
                </Typography>
                <Slider
                  aria-labelledby="opacity-slider"
                  value={opacity}
                  onChange={(e, newValue) => setOpacity(newValue)}
                  step={0.05}
                  marks
                  min={0.1}
                  max={0.7}
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography id="contrast-slider" gutterBottom>
                  Contrast: {contrast}
                </Typography>
                <Slider
                  aria-labelledby="contrast-slider"
                  value={contrast}
                  onChange={(e, newValue) => setContrast(newValue)}
                  step={0.1}
                  marks
                  min={0.8}
                  max={1.5}
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography id="brightness-slider" gutterBottom>
                  Brightness: {brightness}
                </Typography>
                <Slider
                  aria-labelledby="brightness-slider"
                  value={brightness}
                  onChange={(e, newValue) => setBrightness(newValue)}
                  step={0.05}
                  marks
                  min={0.7}
                  max={1.2}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
            
            <Typography variant="h6" sx={{ mt: 4 }}>
              Current settings to copy to BackgroundWrapper.jsx:
            </Typography>
            <Box 
              component="pre" 
              sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1,
                overflow: 'auto',
                width: '100%'
              }}
            >
              {`opacity: ${opacity},\nzIndex: 0,\nfilter: 'contrast(${contrast}) brightness(${brightness})',`}
            </Box>
          </MedicalPaper>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <MedicalPaper>
                <Typography variant="h5" gutterBottom>
                  Sample Form Elements
                </Typography>
                <Box component="form" sx={{ width: '100%' }}>
                  <Stack spacing={2}>
                    <Typography>This simulates how form elements appear over the background</Typography>
                    <TextField label="Text Field" fullWidth />
                    <TextField label="Password" type="password" fullWidth />
                  </Stack>
                </Box>
              </MedicalPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: '300px', 
                border: '1px dashed #ccc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
              }}>
                <Typography>
                  Background without MedicalPaper (semi-transparent box)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default TestBackground; 