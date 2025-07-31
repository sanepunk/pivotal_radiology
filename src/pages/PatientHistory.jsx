import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  Chip,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { ZoomIn, Close, ThreeDRotation } from '@mui/icons-material';
import Layout from '../components/Layout';
import { patientAPI, fileAPI } from '../services/api';

function PatientHistory() {
  const { uid } = useParams();
  const [patient, setPatient] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const [patientResponse, filesResponse] = await Promise.all([
          patientAPI.getPatientById(uid),
          patientAPI.getPatientFiles(uid)
        ]);
        
        setPatient(patientResponse.data);
        console.log(filesResponse.data)
        setFiles(filesResponse.data || []);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setError('Error loading patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [uid]);

  const handleImageClick = (file) => {
    setSelectedImage(file);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  const getImageUrl = (file) => {
    return `http://localhost:8000${file.file_path}`;
  };

  const handle3DRendering = async (file) => {
    try {
      if (file.rendering_3d) {
        console.log(file.rendering_3d)
        await fileAPI.renderVTI(file.rendering_3d);
        console.log('3D rendering request sent successfully');
      } else {
        alert('3D rendering is not available for this image');
      }
    } catch (error) {
      console.error('Error sending 3D rendering request:', error);
      alert('Failed to send 3D rendering request');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Patient History
          </Typography>
          
          {patient && (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Patient Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
                  <Typography variant="subtitle1" color="textSecondary">Name:</Typography>
                  <Typography>{patient.name}</Typography>
                  
                  <Typography variant="subtitle1" color="textSecondary">Patient ID:</Typography>
                  <Typography>{patient.uid}</Typography>
                  
                  <Typography variant="subtitle1" color="textSecondary">Age:</Typography>
                  <Typography>{calculateAge(patient.date_of_birth)} years</Typography>
                  
                  <Typography variant="subtitle1" color="textSecondary">Gender:</Typography>
                  <Typography>{patient.gender}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
                  <Typography variant="subtitle1" color="textSecondary">Phone:</Typography>
                  <Typography>{patient.contact?.phone || 'N/A'}</Typography>
                  
                  <Typography variant="subtitle1" color="textSecondary">Email:</Typography>
                  <Typography>{patient.contact?.email || 'N/A'}</Typography>
                  
                  <Typography variant="subtitle1" color="textSecondary">Address:</Typography>
                  <Typography>{patient.address || 'N/A'}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Medical Reports & Images
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Diagnosis Result</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Original X-ray</TableCell>
                  <TableCell>Segmentation</TableCell>
                  <TableCell>Heatmap</TableCell>
                  <TableCell>3D Rendering</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...files]
                  .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
                  .map((file) => {
                    console.log(file)
                  const tbPrediction = extractTBPrediction(file.notes);
                  return (
                    <TableRow key={file.id}>
                      <TableCell>
                        {format(new Date(file.upload_date), 'MM/dd/yyyy')}
                      </TableCell>
                      <TableCell>{file.doctor_name}</TableCell>
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
                      
                      {/* Original X-ray */}
                      <TableCell>
                        {file.file_type === 'xray' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              component="img"
                              src={getImageUrl(file)}
                              alt={file.file_name}
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: 1,
                              }}
                              onClick={() => handleImageClick(file)}
                            />
                            <IconButton 
                              onClick={() => handleImageClick(file)}
                              size="small"
                            >
                              <ZoomIn />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      
                      {/* Segmentation Mask */}
                      <TableCell>
                        {file.segmentation_mask && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              component="img"
                              src={`http://localhost:8000${file.segmentation_mask}`}
                              alt="Segmentation Mask"
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: 1,
                              }}
                              onClick={() => handleImageClick({...file, file_path: file.segmentation_mask, file_name: 'Segmentation Mask'})}
                            />
                            <IconButton 
                              onClick={() => handleImageClick({...file, file_path: file.segmentation_mask, file_name: 'Segmentation Mask'})}
                              size="small"
                            >
                              <ZoomIn />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      
                      {/* Heatmap Overlay */}
                      <TableCell>
                        {tbPrediction?.result === 'TB Positive' && file.heatmap_overlay && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              component="img"
                              src={`http://localhost:8000${file.heatmap_overlay}`}
                              alt="Heatmap Overlay"
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: 1,
                              }}
                              onClick={() => handleImageClick({...file, file_path: file.heatmap_overlay, file_name: 'Heatmap Overlay'})}
                            />
                            <IconButton 
                              onClick={() => handleImageClick({...file, file_path: file.heatmap_overlay, file_name: 'Heatmap Overlay'})}
                              size="small"
                            >
                              <ZoomIn />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      
                      {/* 3D Rendering Button */}
                      <TableCell>
                        {tbPrediction?.result === 'TB Positive' && file.rendering_3d && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ThreeDRotation />}
                            onClick={() => handle3DRendering(file)}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            3D View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {files.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No medical reports available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="lg"
            fullWidth
          >
            <DialogContent sx={{ position: 'relative', p: 0 }}>
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  zIndex: 1,
                }}
              >
                <Close />
              </IconButton>
              {selectedImage && (
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={getImageUrl(selectedImage)}
                    alt={selectedImage.file_name}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  {selectedImage.notes && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        p: 2,
                      }}
                    >
                      <Typography variant="subtitle1">Notes:</Typography>
                      <Typography>{selectedImage.notes}</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </Paper>
      </Container>
    </Layout>
  );
}

export default PatientHistory; 