import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import Layout from '../components/Layout';

function PatientHistory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    name: '',
    uid: '',
    mobile: '',
    date: '',
  });

  // Mock data for demonstration
  const mockPatients = [
    {
      uid: 'TB-2024-ABC123',
      name: 'John Doe',
      age: 45,
      date: '2024-03-25',
      status: 'Benign',
      mobile: '1234567890',
    },
    {
      uid: 'TB-2024-DEF456',
      name: 'Jane Smith',
      age: 32,
      date: '2024-03-24',
      status: 'Malignant',
      mobile: '9876543210',
    },
  ];

  const handleSearch = (event) => {
    event.preventDefault();
    // Implement search logic here
  };

  const handleViewPatient = (patient) => {
    navigate('/patient/new', { state: { patientData: patient } });
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Patient History
          </Typography>

          <Box component="form" onSubmit={handleSearch} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <TextField
                label="Patient Name"
                value={searchParams.name}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, name: e.target.value })
                }
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="UID"
                value={searchParams.uid}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, uid: e.target.value })
                }
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Mobile Number"
                value={searchParams.mobile}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, mobile: e.target.value })
                }
                sx={{ flexGrow: 1 }}
              />
              <TextField
                type="date"
                label="Visit Date"
                value={searchParams.date}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<Search />}
                sx={{ minWidth: '120px' }}
              >
                Search
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>UID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Visit Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPatients.map((patient) => (
                  <TableRow
                    key={patient.uid}
                    sx={{
                      backgroundColor:
                        patient.status === 'Malignant'
                          ? 'rgba(255, 0, 0, 0.05)'
                          : 'inherit',
                    }}
                  >
                    <TableCell>{patient.uid}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.date}</TableCell>
                    <TableCell>{patient.status}</TableCell>
                    <TableCell>{patient.mobile}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Layout>
  );
}

export default PatientHistory; 