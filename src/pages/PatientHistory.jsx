import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { patientAPI } from '../services/api';

function PatientHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPatients();
      setPatients(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch patient records');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.searchPatients({ query: searchQuery });
      setPatients(response.data);
      setError('');
    } catch (err) {
      setError('Failed to search patient records');
      console.error('Error searching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom align="center">
          Patient History
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Search Patients"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.map((patient) => (
                    <TableRow key={patient.uid}>
                      <TableCell>
                        {`${patient.firstName} ${patient.lastName}`}
                      </TableCell>
                      <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.contactNumber}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => navigate(`/patients/${patient.uid}`)}
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => navigate(`/patients/${patient.uid}/edit`)}
                          title="Edit Patient"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
}

export default PatientHistory; 