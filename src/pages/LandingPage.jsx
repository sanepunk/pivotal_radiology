import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import logo from '../assets/Icon.png';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '3rem',
  marginTop: '-4rem',
  paddingTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000080 30%, #1976d2 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 128, .3)',
  color: 'white',
  padding: '12px 30px',
  marginTop: '1rem',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 10px 2px rgba(0, 0, 128, .3)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%)',
  padding: '4rem 0',
  borderRadius: '0 0 50% 50%/30%',
  marginBottom: '1rem',
}));

const LogoImg = styled('img')({
  height: '150px',
  marginBottom: '1.5rem',
});

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeroSection>
        <Container>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <LogoImg src={logo} alt="TB Screening Portal Logo" />
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              fontWeight="700"
              sx={{ color: '#000080' }}
            >
              TB Screening System
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mb: 4, color: '#333' }}>
              Advanced Tuberculosis Detection and Patient Management
            </Typography>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ flex: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <StyledPaper elevation={6}>
              {/* <Typography variant="h4" gutterBottom>
                Welcome to the TB Screening Portal
              </Typography> */}
              <Typography variant="body1" paragraph align="center" sx={{ maxWidth: '600px', mb: 4, fontSize: '22px' }}>
                Our platform provides healthcare professionals with tools for TB detection,
                patient management, and analysis of medical imaging for more efficient diagnosis.
              </Typography>
              
              <Grid container spacing={3} justifyContent="center">
                <Grid item>
                  <GradientButton 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/auth', { state: { defaultTab: 'login' }})}
                  >
                    Login
                  </GradientButton>
                </Grid>
                <Grid item>
                  <GradientButton 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/auth', { state: { defaultTab: 'register' } })}
                    color="secondary"
                  >
                    Register
                  </GradientButton>
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          mt: 6, 
          py: 3, 
          backgroundColor: '#f5f5f5',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          Software is for binary TB detection only (colour-coded by severity).
          Confirm with a physician.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          © 2025 All rights reserved.
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

export default LandingPage; 