import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';
import PatientHistory from './PatientHistory';
import FileUpload from './FileUpload';

const PatientDetails = () => {
  const { patientUid } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientUid) {
      setError('No patient ID provided');
      return;
    }
    fetchPatientData();
    fetchPatientHistory();
  }, [patientUid]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPatientById(patientUid);
      setPatient(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientHistory = async () => {
    try {
      const response = await patientAPI.getPatientHistory(patientUid);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching patient history:', error);
      setError('Failed to load patient history');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientAPI.updatePatient(patientUid, editForm);
      setShowEditModal(false);
      fetchPatientData();
    } catch (error) {
      console.error('Error updating patient:', error);
      setError('Failed to update patient information');
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <Typography>Loading patient information...</Typography>
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!patient) return <Alert severity="warning">Patient not found</Alert>;

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Patient Details</Typography>
              <Typography variant="body2" color="textSecondary">
                UID: {patientUid}
              </Typography>
            </Box>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowEditModal(true)}
            >
              Edit Patient
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Demographics
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Name" secondary={patient.name} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={format(new Date(patient.date_of_birth), 'MM/dd/yyyy')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Gender" secondary={patient.gender} />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Phone" secondary={patient.contact.phone} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={patient.contact.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Address" secondary={patient.contact.address} />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Insurance Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Provider"
                    secondary={patient.insurance?.provider || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Policy Number"
                    secondary={patient.insurance?.policy_number || 'Not provided'}
                  />
                </ListItem>
                {patient.insurance?.expiry_date && (
                  <ListItem>
                    <ListItemText
                      primary="Expiry Date"
                      secondary={format(new Date(patient.insurance.expiry_date), 'MM/dd/yyyy')}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Medical Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Allergies"
                    secondary={
                      patient.allergies?.length > 0
                        ? patient.allergies.join(', ')
                        : 'No known allergies'
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <FileUpload 
        patientUid={patientUid} 
        onFileUploaded={fetchPatientHistory}
      />

      <PatientHistory
        patientUid={patientUid}
        history={history}
        onHistoryUpdate={fetchPatientHistory}
      />

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Patient Information</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date of Birth"
                  value={editForm.date_of_birth ? new Date(editForm.date_of_birth) : null}
                  onChange={(date) =>
                    setEditForm({
                      ...editForm,
                      date_of_birth: format(date, 'yyyy-MM-dd'),
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={editForm.gender || ''}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  required
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={editForm.contact?.phone || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      contact: { ...editForm.contact, phone: e.target.value },
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editForm.contact?.email || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      contact: { ...editForm.contact, email: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={editForm.contact?.address || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      contact: { ...editForm.contact, address: e.target.value },
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Insurance Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Provider"
                  value={editForm.insurance?.provider || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      insurance: { ...editForm.insurance, provider: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Policy Number"
                  value={editForm.insurance?.policy_number || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      insurance: {
                        ...editForm.insurance,
                        policy_number: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDetails; 