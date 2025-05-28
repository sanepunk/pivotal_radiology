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
  Divider,
} from '@mui/material';
import {
  PersonAdd,
  History,
  CloudUpload,
  Assessment,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import PatientList from '../components/PatientList';

function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const cards = [
    {
      title: 'New Patient',
      description: 'Register a new patient and start TB screening',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      action: () => navigate('/patients/register'),
    },
    {
      title: 'Patient History',
      description: 'View and manage existing patient records',
      icon: <History sx={{ fontSize: 40 }} />,
      action: () => navigate('/patients/history'),
    },
    {
      title: 'Upload X-ray/CT',
      description: 'Upload and analyze medical images',
      icon: <CloudUpload sx={{ fontSize: 40 }} />,
      action: () => navigate('/upload'),
    },
    {
      title: 'Reports',
      description: 'Generate and view TB screening reports',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      action: () => navigate('/report'),
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
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
          sx={{ mb: 4 }}
        >
          Welcome to TB Screening Portal
        </Typography>

        <Grid container spacing={4}>
          {cards.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
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
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={card.action}
                    sx={{ mx: 2, mb: 2 }}
                  >
                    {`Go to ${card.title}`}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={6} mb={4}>
          <Divider />
        </Box>

        <Box mt={4}>
          <PatientList />
        </Box>
      </Container>
    </Layout>
  );
}

export default Welcome; 