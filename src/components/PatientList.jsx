import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { patientAPI } from '../services/api';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPatients();
      setPatients(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (patientUid) => {
    navigate(`/patients/${patientUid}`);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Patient List
        </Typography>
        <TextField
          fullWidth
          label="Search patients by name or ID"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow
                  key={patient.uid}
                  onClick={() => handleRowClick(patient.uid)}
                  hover
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{patient.uid}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    {format(new Date(patient.date_of_birth), 'MM/dd/yyyy')}
                  </TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>
                    {patient.contact.phone}
                    <br />
                    {patient.contact.email}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientList; 