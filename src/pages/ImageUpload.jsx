import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
  Alert,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Layout from '../components/Layout';
import LoadingTips from '../components/LoadingTips';

function ImageUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientData = location.state?.patientData;

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

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
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate file upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Clear interval
      clearInterval(interval);
      setProgress(100);

      // Navigate to results page
      navigate('/visualize', {
        state: {
          patientData,
          imageData: {
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            preview: preview,
          },
          diagnosis: {
            result: 'benign', // This would come from the API
            confidence: 0.95,
          },
        },
      });
    } catch (error) {
      setError('Error uploading file. Please try again.');
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

          {patientData && (
            <Typography variant="subtitle1" gutterBottom>
              Patient: {patientData.name} (UID: {patientData.uid})
            </Typography>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              type="file"
              id="file-input"
              accept=".dcm,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Click to upload or drag and drop
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
            </Box>
          )}

          {uploading && <LoadingTips progress={progress} />}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
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