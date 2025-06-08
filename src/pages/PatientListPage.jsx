import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Alert,
} from '@mui/material';
import Layout from '../components/Layout';
import PatientList from '../components/PatientList';
import BackgroundImage from '../components/BackgroundImage';
import MedicalPaper from '../components/MedicalPaper';

function PatientListPage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <Layout>
      <BackgroundImage />
      <Container maxWidth="lg">
        <MedicalPaper elevation={3}>
          {message && (
            <Alert 
              severity="info" 
              sx={{ mb: 3, width: '100%' }}
              onClose={() => {
                window.history.replaceState({}, document.title);
              }}
            >
              {message}
            </Alert>
          )}
          
          <PatientList />
        </MedicalPaper>
      </Container>
    </Layout>
  );
}

export default PatientListPage; 