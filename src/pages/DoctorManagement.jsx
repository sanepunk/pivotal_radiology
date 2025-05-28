import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, PersonAdd } from '@mui/icons-material';
import Layout from '../components/Layout';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await authAPI.getDoctors();
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Error loading doctors');
      setLoading(false);
      if (error.response?.status === 403) {
        navigate('/');
      }
    }
  };

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await authAPI.deleteDoctor(selectedDoctor.email);
      setDoctors(doctors.filter(d => d.email !== selectedDoctor.email));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Error deleting doctor');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Doctor Management</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/register')}
            >
              Add New Doctor
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.email}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>{doctor.role}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(doctor)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete doctor {selectedDoctor?.name}?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Layout>
  );
}

export default DoctorManagement; 