import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';

function PatientRegisterSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(30);
  
  // Get the patient data from location state
  const patientData = location.state?.patientData || {};

  useEffect(() => {
    // Redirect if no data is provided
    if (!patientData.uid) {
      navigate('/patients/register');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/welcome');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, patientData]);

  const handleHomeClick = () => {
    navigate('/welcome');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ py: 5 }}>
      <Paper 
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 'md',
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        
        <Typography variant="h1" gutterBottom align="center" color="primary">
          Patient Registered Successfully!
        </Typography>
        
        <Box sx={{ width: '100%', mb: 4, mt: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4,
            p: 2,
            bgcolor: '#f5f9ff',
            borderRadius: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Patient Name
              </Typography>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                {patientData.name || 'N/A'}
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Patient ID
              </Typography>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                {patientData.uid}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h3" gutterBottom align="center" color="primary" sx={{ mb: 3 }}>
            Patient Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {formatDate(patientData.date_of_birth)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {patientData.gender ? patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1) : 'N/A'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {patientData.contact?.phone || 'N/A'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {patientData.contact?.email || 'N/A'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {patientData.address || 'N/A'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Medical History
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {patientData.medical_history || 'None'}
              </Typography>
            </Grid>
          </Grid>
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
            Redirecting to home page in {countdown} seconds
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleHomeClick}
          sx={{ minWidth: 200 }}
        >
          Go to Home
        </Button>
      </Paper>
    </Container>
  );
}

export default PatientRegisterSuccess; 