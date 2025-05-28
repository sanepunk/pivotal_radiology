import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import Layout from '../components/Layout';
import PatientList from '../components/PatientList';

function PatientListPage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {message && (
            <Alert 
              severity="info" 
              sx={{ mb: 3 }}
              onClose={() => {
                window.history.replaceState({}, document.title);
              }}
            >
              {message}
            </Alert>
          )}
          
          <PatientList />
        </Paper>
      </Container>
    </Layout>
  );
}

export default PatientListPage; 