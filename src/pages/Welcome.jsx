import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  PersonAdd,
  History,
  CloudUpload,
  Assessment,
} from '@mui/icons-material';
import Layout from '../components/Layout';

function Welcome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'New Patient',
      description: 'Register a new patient and start TB screening',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      action: () => navigate('/patient/new'),
    },
    {
      title: 'Patient History',
      description: 'View and manage existing patient records',
      icon: <History sx={{ fontSize: 40 }} />,
      action: () => navigate('/patient/history'),
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
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                      color: 'primary.main',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {card.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
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
                    {card.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

export default Welcome; 