import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { patientAPI } from '../services/api';

const PatientHistory = ({ patientUid, history, onHistoryUpdate }) => {
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [newVisit, setNewVisit] = useState({
    visit_date: format(new Date(), 'yyyy-MM-dd'),
    doctor: '',
    chief_complaint: '',
    notes: '',
    diagnoses: [],
    procedures: [],
    prescribed_medications: []
  });
  const [diagnosis, setDiagnosis] = useState({ condition: '', diagnosed_by: '', notes: '' });
  const [procedure, setProcedure] = useState({ name: '', performed_by: '', notes: '', date: format(new Date(), 'yyyy-MM-dd') });
  const [error, setError] = useState('');

  const handleAddDiagnosis = () => {
    if (!diagnosis.condition || !diagnosis.diagnosed_by) {
      setError('Please fill in both condition and diagnosed by fields');
      return;
    }
    setNewVisit({
      ...newVisit,
      diagnoses: [...newVisit.diagnoses, diagnosis]
    });
    setDiagnosis({ condition: '', diagnosed_by: '', notes: '' });
    setError('');
  };

  const handleAddProcedure = () => {
    if (!procedure.name || !procedure.performed_by) {
      setError('Please fill in both procedure name and performed by fields');
      return;
    }
    setNewVisit({
      ...newVisit,
      procedures: [...newVisit.procedures, procedure]
    });
    setProcedure({ name: '', performed_by: '', notes: '', date: format(new Date(), 'yyyy-MM-dd') });
    setError('');
  };

  const handleSubmitVisit = async (e) => {
    e.preventDefault();
    if (!newVisit.doctor || !newVisit.chief_complaint) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await patientAPI.addVisitHistory(patientUid, newVisit);
      setShowAddVisitModal(false);
      onHistoryUpdate();
      setNewVisit({
        visit_date: format(new Date(), 'yyyy-MM-dd'),
        doctor: '',
        chief_complaint: '',
        notes: '',
        diagnoses: [],
        procedures: [],
        prescribed_medications: []
      });
      setError('');
    } catch (error) {
      console.error('Error adding visit:', error);
      setError('Failed to add visit. Please try again.');
    }
  };

  const extractTBPrediction = (notes) => {
    if (!notes) return null;
    const match = notes.match(/\[TB Prediction: (.*?) \((\d+\.\d+)%\)\]/);
    if (match) {
      return {
        result: match[1],
        confidence: parseFloat(match[2])
      };
    }
    return null;
  };

  if (!patientUid) {
    return <Alert severity="warning">Patient UID is required to view history</Alert>;
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Visit History</Typography>
            <Typography variant="body2" color="textSecondary">
              Patient UID: {patientUid}
            </Typography>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAddVisitModal(true)}
          >
            Add New Visit
          </Button>
        }
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {history.length === 0 ? (
          <Alert severity="info">No visit history available</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Chief Complaint</TableCell>
                  <TableCell>TB Prediction</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Diagnoses</TableCell>
                  <TableCell>Procedures</TableCell>
                  <TableCell>Files</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((visit) => {
                  const tbPrediction = extractTBPrediction(visit.notes);
                  return (
                    <TableRow key={visit.id}>
                      <TableCell>{format(new Date(visit.visit_date), 'MM/dd/yyyy')}</TableCell>
                      <TableCell>{visit.doctor}</TableCell>
                      <TableCell>{visit.chief_complaint}</TableCell>
                      <TableCell>
                        {tbPrediction ? (
                          <Chip
                            label={tbPrediction.result}
                            color={tbPrediction.result === 'TB Positive' ? 'error' : 'success'}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {tbPrediction ? `${tbPrediction.confidence.toFixed(1)}%` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {visit.diagnoses.map((diagnosis, idx) => (
                          <Chip
                            key={idx}
                            label={diagnosis.condition}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        {visit.procedures.map((procedure, idx) => (
                          <Chip
                            key={idx}
                            label={procedure.name}
                            color="secondary"
                            variant="outlined"
                            size="small"
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        {visit.files.map((file) => (
                          <Button
                            key={file.id}
                            size="small"
                            onClick={() => window.open(`/files/${file.id}`)}
                          >
                            {file.file_type}
                          </Button>
                        ))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      <Dialog
        open={showAddVisitModal}
        onClose={() => setShowAddVisitModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Visit</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Visit Date"
                value={new Date(newVisit.visit_date)}
                onChange={(date) =>
                  setNewVisit({
                    ...newVisit,
                    visit_date: format(date, 'yyyy-MM-dd'),
                  })
                }
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Doctor"
                value={newVisit.doctor}
                onChange={(e) => setNewVisit({ ...newVisit, doctor: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chief Complaint"
                value={newVisit.chief_complaint}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, chief_complaint: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newVisit.notes}
                onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
              />
            </Grid>
          </Grid>

          <Card sx={{ mt: 2, mb: 2 }}>
            <CardHeader title="Current Diagnoses" />
            <CardContent>
              {newVisit.diagnoses.length > 0 ? (
                <Grid container spacing={1}>
                  {newVisit.diagnoses.map((d, idx) => (
                    <Grid item key={idx}>
                      <Chip
                        label={`${d.condition} by ${d.diagnosed_by}`}
                        color="primary"
                        variant="outlined"
                        onDelete={() =>
                          setNewVisit({
                            ...newVisit,
                            diagnoses: newVisit.diagnoses.filter((_, i) => i !== idx),
                          })
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="textSecondary">No diagnoses added yet</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardHeader title="Add Diagnosis" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Condition"
                    value={diagnosis.condition}
                    onChange={(e) =>
                      setDiagnosis({ ...diagnosis, condition: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Diagnosed By"
                    value={diagnosis.diagnosed_by}
                    onChange={(e) =>
                      setDiagnosis({ ...diagnosis, diagnosed_by: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={diagnosis.notes}
                    onChange={(e) =>
                      setDiagnosis({ ...diagnosis, notes: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="outlined"
                onClick={handleAddDiagnosis}
                sx={{ mt: 2 }}
              >
                Add Diagnosis
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardHeader title="Current Procedures" />
            <CardContent>
              {newVisit.procedures.length > 0 ? (
                <Grid container spacing={1}>
                  {newVisit.procedures.map((p, idx) => (
                    <Grid item key={idx}>
                      <Chip
                        label={`${p.name} by ${p.performed_by}`}
                        color="secondary"
                        variant="outlined"
                        onDelete={() =>
                          setNewVisit({
                            ...newVisit,
                            procedures: newVisit.procedures.filter((_, i) => i !== idx),
                          })
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="textSecondary">No procedures added yet</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Add Procedure" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={procedure.name}
                    onChange={(e) =>
                      setProcedure({ ...procedure, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Performed By"
                    value={procedure.performed_by}
                    onChange={(e) =>
                      setProcedure({ ...procedure, performed_by: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Date"
                    value={new Date(procedure.date)}
                    onChange={(date) =>
                      setProcedure({
                        ...procedure,
                        date: format(date, 'yyyy-MM-dd'),
                      })
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={procedure.notes}
                    onChange={(e) =>
                      setProcedure({ ...procedure, notes: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="outlined"
                onClick={handleAddProcedure}
                sx={{ mt: 2 }}
              >
                Add Procedure
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddVisitModal(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmitVisit}>
            Save Visit
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PatientHistory; 