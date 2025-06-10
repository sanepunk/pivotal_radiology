import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PersonAdd,
  History,
  CloudUpload,
  Assessment,
  People,
  Logout,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
        
        // Also verify with backend
        const response = await authAPI.verifyToken();
        setUserData(response.data);
      } catch (error) {
        console.error('Error verifying auth:', error);
        if (error.response?.status === 401) {
          navigate('/auth');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to landing page with proper trailing slash
    window.location.href = '/app/';
  };

  const cards = [
    {
      title: 'New Patient',
      description: 'Register a new patient',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      action: () => navigate('/patients/register'),
    },
    {
      title: 'Patient List',
      description: 'View and manage existing patient records',
      icon: <History sx={{ fontSize: 40 }} />,
      action: () => navigate('/patients', { state: { message: 'Please select a patient to view their history' } }),
    },
    {
      title: 'Upload X-ray',
      description: 'Upload and analyze medical images',
      icon: <CloudUpload sx={{ fontSize: 40 }} />,
      action: () => navigate('/upload'),
    },
    // {
    //   title: 'Reports',
    //   description: 'Generate and view TB screening reports',
    //   icon: <Assessment sx={{ fontSize: 40 }} />,
    //   action: () => navigate('/report'),
    // },
    ...(userData?.role === 'admin' ? [{
      title: 'Doctor Management',
      description: 'Manage doctors and their accounts',
      icon: <People sx={{ fontSize: 40 }} />,
      action: () => navigate('/doctors'),
    }] : []),
  ];

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <BackgroundWrapper>
        <Container maxWidth={false} disableGutters sx={{ mt: 4, mb: 4 }}>
          {message && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, mx: 2 }}
              onClose={() => {
                // Clear the message from location state
                window.history.replaceState({}, document.title)
              }}
            >
              {message}
            </Alert>
          )}
          
          <Typography
            component="h1"
            variant="h4"
            color="primary"
            gutterBottom
            align="center"
            sx={{fontSize: '26px', fontWeight: 'bold', mb: 4}}
          >
            {/* TB Screening System */}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 300px)',
                gridTemplateRows: 'auto',
                gap: '30px',
                maxWidth: '960px',
                margin: '0 auto'
              }}
            >
              {/* First row with three cards */}
              {cards.slice(0, 3).map((card, index) => (
                <Card
                  key={index}
                  sx={{
                    width: '100%',
                    height: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent 
                    sx={{ 
                      flexGrow: 1, 
                      textAlign: 'center', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      padding: '16px'
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {card.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ padding: '16px' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={card.action}
                    >
                      {`Go to ${card.title}`}
                    </Button>
                  </CardActions>
                </Card>
              ))}
              
              {/* Second row with Doctor Management centered if admin */}
              {userData?.role === 'admin' && cards.length > 3 && (
                <Box sx={{ 
                  gridColumn: '2',
                  gridRow: '2',
                  marginTop: '20px'
                }}>
                  <Card
                    sx={{
                      width: '300px',
                      height: '250px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        flexGrow: 1, 
                        textAlign: 'center', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        padding: '16px'
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        {cards[3].icon}
                      </Box>
                      <Typography gutterBottom variant="h5" component="h2">
                        {cards[3].title}
                      </Typography>
                      <Typography>
                        {cards[3].description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ padding: '16px' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={cards[3].action}
                      >
                        {`Go to ${cards[3].title}`}
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </BackgroundWrapper>
    </Layout>
  );
}

export default Welcome; 