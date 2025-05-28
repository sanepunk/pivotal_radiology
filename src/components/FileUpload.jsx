import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
} from '@mui/material';
import { fileAPI } from '../services/api';

const FileUpload = ({ patientUid, onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('xray');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = {
      'xray': ['image/png', 'image/jpeg', 'application/dicom'],
      'report': ['application/pdf']
    };

    if (!allowedTypes[fileType].includes(selectedFile.type)) {
      setError(`Please select a valid file type for ${fileType}. Allowed types: ${allowedTypes[fileType].join(', ')}`);
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (!patientUid) {
      setError('Patient UID is required for file upload');
      return;
    }
    if (!doctorName.trim()) {
      setError('Doctor name is required');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientUid', patientUid);
    formData.append('doctor_name', doctorName);
    // Only append notes if it has a value
    if (notes && notes.trim()) {
      formData.append('notes', notes.trim());
    }

    // Debug logging
    console.log('Uploading file with data:', {
      fileName: file.name,
      fileType: file.type,
      patientUid,
      doctorName,
      notes: notes || ''
    });

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await fileAPI.uploadFile(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      console.log('Upload response:', response);

      // Clear form after successful upload
      setFile(null);
      setPreview(null);
      setUploadProgress(0);
      setNotes('');
      setDoctorName('');
      setError('');
      if (onFileUploaded) onFileUploaded();
    } catch (error) {
      console.error('Upload error:', error.response?.data || error);
      const errorMessage = error.response?.data?.detail || error.message || 'Error uploading file. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (!patientUid) {
    return <Alert severity="warning">Patient UID is required for file upload</Alert>;
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Upload {fileType === 'xray' ? 'X-Ray' : 'Report'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Patient UID: {patientUid}
            </Typography>
          </Box>
        }
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleUpload}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>File Type</InputLabel>
            <Select
              value={fileType}
              label="File Type"
              onChange={(e) => {
                setFileType(e.target.value);
                setFile(null);
                setPreview(null);
              }}
            >
              <MenuItem value="xray">X-Ray</MenuItem>
              <MenuItem value="report">Report (PDF)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            label="Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <input
              accept={fileType === 'xray' ? 'image/*' : '.pdf'}
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span" fullWidth>
                Choose {fileType === 'xray' ? 'X-Ray' : 'Report'} File
              </Button>
            </label>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {fileType === 'xray'
                ? 'Accepted formats: JPEG, PNG, DICOM'
                : 'Accepted format: PDF'}
            </Typography>
          </Box>

          {preview && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Preview
              </Typography>
              <img
                src={preview}
                alt="File preview"
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
              />
            </Box>
          )}

          {uploading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="textSecondary" align="center">
                {uploadProgress}%
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!file || uploading || !doctorName.trim()}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FileUpload; 