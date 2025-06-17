import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BackgroundImage from '../components/BackgroundImage';
import MedicalPaper from '../components/MedicalPaper';

function DoctorRegisterSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  
  // Get the doctor data from location state
  const { email, password, name } = location.state || {};

  useEffect(() => {
    // Redirect if no data is provided
    if (!email || !password) {
      navigate('/auth');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/auth', { state: { defaultTab: 'login' }});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, email, password]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    navigate('/auth', { state: { defaultTab: 'login' }});
  };

  return (
    <>
      <BackgroundImage />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <MedicalPaper 
          elevation={3}
          sx={{
            maxWidth: 'sm',
            mx: 'auto',
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h1" gutterBottom align="center" color="primary">
            Registration Successful!
          </Typography>
          
          <Box sx={{ 
            width: '100%', 
            mb: 4, 
            mt: 2,
            textAlign: 'center',
            p: 3,
            bgcolor: '#f5f9ff',
            borderRadius: 2
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Doctor Name
            </Typography>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              {name}
            </Typography>
          </Box>

          <Typography variant="h3" align="center" color="primary" sx={{ mb: 3 }}>
            Login Credentials
          </Typography>

          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="h3" align="center" sx={{ bgcolor: '#f0f0f0', py: 2, borderRadius: 1 }}>
                {email}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Password
              </Typography>
              <Box sx={{ 
                position: 'relative', 
                bgcolor: '#f0f0f0', 
                py: 2, 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h3" align="center">
                  {showPassword ? password : '•'.repeat(password?.length || 6)}
                </Typography>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  sx={{ position: 'absolute', right: 8 }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={(countdown / 30) * 100}
              size={40}
              thickness={4}
              sx={{ mr: 2 }}
            />
            <Typography variant="body1">
              Redirecting to login page in {countdown} seconds
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
            sx={{ minWidth: 200 }}
          >
            Go to Login
          </Button>
        </MedicalPaper>
      </Container>
    </>
  );
}

export default DoctorRegisterSuccess;
