import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ZoomIn, Close, Description } from '@mui/icons-material';
import { format } from 'date-fns';
import { patientAPI } from '../services/api';

const PatientFiles = ({ patientUid }) => {
  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await patientAPI.getPatientFiles(patientUid);
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching patient files:', error);
      }
    };

    if (patientUid) {
      fetchFiles();
    }
  }, [patientUid]);

  const handleImageClick = (file) => {
    setSelectedImage(file);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  const getImageUrl = (fileId) => {
    return `${import.meta.env.VITE_API_URL}/patients/files/${fileId}`;
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file._id}>
                <TableCell style={{ width: 100 }}>
                  {file.file_type === 'xray' ? (
                    <Box
                      component="img"
                      src={getImageUrl(file._id)}
                      alt={file.file_name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageClick(file)}
                    />
                  ) : (
                    <Description sx={{ fontSize: 40, color: 'text.secondary' }} />
                  )}
                </TableCell>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{file.file_type}</TableCell>
                <TableCell>
                  {format(new Date(file.upload_date), 'MM/dd/yyyy HH:mm')}
                </TableCell>
                <TableCell>{file.notes || 'No notes'}</TableCell>
                <TableCell>
                  {file.file_type === 'xray' && (
                    <IconButton onClick={() => handleImageClick(file)}>
                      <ZoomIn />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {files.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No files uploaded yet
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
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <Box sx={{ position: 'relative' }}>
              <img
                src={getImageUrl(selectedImage._id)}
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
    </Box>
  );
};

export default PatientFiles; 