import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
  Alert,
  TextField,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Layout from '../components/Layout';
import LoadingTips from '../components/LoadingTips';
import { fileAPI, patientAPI } from '../services/api';

function ImageUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patientUid, setPatientUid] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    // Fetch all patients when component mounts
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getPatients();
      setPatients(response.data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handlePatientSelect = (event, value) => {
    if (value) {
      setPatientUid(value.uid);
      setPatientData(value);
      setError('');
    } else {
      setPatientUid('');
      setPatientData(null);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'application/dicom') {
        setSelectedFile(file);
        if (file.type !== 'application/dicom') {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
        setError('');
      } else {
        setError('Please upload a valid DICOM, PNG, or JPEG file');
        setSelectedFile(null);
        setPreview('');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!patientData) {
      setError('Please enter a valid patient ID first');
      return;
    }

    if (!doctorName.trim()) {
      setError('Doctor name is required');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientUid', patientData.uid);
      formData.append('doctor_name', doctorName);
      if (notes.trim()) {
        formData.append('notes', notes);
      }

      const response = await fileAPI.uploadFile(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });

      // Navigate to visualization page
      navigate('/visualize', {
        state: {
          patientData,
          imageData: {
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            preview: preview,
            ...response.data
          }
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Upload Medical Image
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Autocomplete
                fullWidth
                options={patients}
                getOptionLabel={(option) => `${option.name} (${option.uid})`}
                value={patientData}
                onChange={handlePatientSelect}
                inputValue={searchText}
                onInputChange={(event, newInputValue) => {
                  setSearchText(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Patient by Name or ID"
                    required
                    error={Boolean(error && error.includes('patient'))}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {option.uid}
                      </Typography>
                    </Box>
                  </Box>
                )}
                loading={loading}
                loadingText="Loading patients..."
                noOptionsText="No patients found"
              />
            </Box>
          </Box>

          {patientData && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Patient selected: {patientData.name} (ID: {patientData.uid})
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            error={Boolean(error && error.includes('doctor'))}
            helperText={error && error.includes('doctor') ? error : ''}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: patientData ? 'pointer' : 'not-allowed',
              opacity: patientData ? 1 : 0.7,
              '&:hover': {
                borderColor: patientData ? 'primary.main' : '#ccc',
              },
            }}
            onClick={() => patientData && document.getElementById('file-input').click()}
          >
            <input
              type="file"
              id="file-input"
              accept=".dcm,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              disabled={!patientData}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {patientData ? 'Click to upload or drag and drop' : 'Please select a patient first'}
            </Typography>
            <Typography color="textSecondary">
              Supported formats: DICOM, PNG, JPEG
            </Typography>
          </Box>

          {selectedFile && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Selected file: {selectedFile.name}
              </Typography>
              {preview && (
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              )}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}

          {uploading && <LoadingTips progress={progress} />}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={!selectedFile || !patientData || uploading || !doctorName.trim()}
            sx={{ mt: 3 }}
          >
            {uploading ? 'Uploading...' : 'Upload & Analyze'}
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}

export default ImageUpload; 