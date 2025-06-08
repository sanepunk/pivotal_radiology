import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  CircularProgress,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Layout from '../components/Layout';
import IconImage from '../assets/Icon.png';
import { calculateAge } from '../utils/dateUtils';

function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData, imageData, diagnosis, visualizationData } = location.state || {};
  const tbConfidence = 99.26; // This would come from your ML model in reality

  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [error, setError] = useState('');

  const handleGeneratePDF = () => {
    setShowPasswordDialog(true);
  };

  const handleDownloadPDF = async () => {
    if (!password) {
      setError('Please enter a password for the PDF');
      return;
    }

    setShowPasswordDialog(false);
    setGeneratingPDF(true);
    setPdfProgress(0);

    // Simulate PDF generation progress
    const interval = setInterval(() => {
      setPdfProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const doc = new jsPDF({
        encryption: {
          userPassword: password,
          ownerPassword: password,
          userPermissions: ['print', 'copy']
        }
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 5;

      // Add header with logo and border line
      doc.addImage(IconImage, 'PNG', 20, yPosition, 40, 12);
      yPosition = yPosition + 10;
      // Title - moved above the line
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 128); // Navy Blue
      doc.setFont(undefined, 'bold');
      doc.text('TB Screening Report', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      // Header border line
      doc.setDrawColor(0, 0, 128); // Navy Blue
      doc.setLineWidth(0.5);
      doc.line(20, yPosition + 16, pageWidth - 20, yPosition + 16);
      yPosition = yPosition + 30;

      // Add TB Confidence Score with adjusted positioning
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.setFont(undefined, 'bold');
      doc.text('TB Detection Confidence:', 25, yPosition);
      
      // Add progress bar with adjusted dimensions
      const barWidth = 50;
      const barHeight = 6;
      const startX = 120;
      
      // Draw background bar
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(200, 200, 200);
      doc.roundedRect(startX, yPosition - 4, barWidth, barHeight, 1, 1, 'F');
      
      // Draw filled portion
      doc.setDrawColor(0, 0, 128);
      doc.setFillColor(0, 0, 128);
      doc.roundedRect(startX, yPosition - 4, (tbConfidence / 100) * barWidth, barHeight, 1, 1, 'F');
      
      // Add percentage text
      doc.setFontSize(11);
      doc.text(`${tbConfidence}%`, startX + barWidth + 3, yPosition);
      yPosition += 20;

      // Section Headers Style
      const addSectionHeader = (text, y) => {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 128);
        doc.setFont(undefined, 'bold');
        doc.text(text, 20, y);
        doc.setLineWidth(0.2);
        doc.line(20, y + 2, pageWidth - 20, y + 2);
        return y + 12;
      };

      // I. X-Ray Details
      yPosition = addSectionHeader('I. X-Ray Details', yPosition);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.text(`View: Posteroanterior (PA)`, 25, yPosition); yPosition += 7;
      doc.text(`Date: ${new Date().toLocaleString()}`, 25, yPosition); yPosition += 7;
      doc.text(`Technician: A. Smith, RT(R)`, 25, yPosition); yPosition += 7;
      doc.text(`Reporting Radiologist: Dr. Jane Patel, MD`, 25, yPosition); yPosition += 15;

      // II. Radiology Report
      yPosition = addSectionHeader('II. Radiology Report', yPosition);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Overall Impression', 25, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('Findings are suggestive of active pulmonary tuberculosis.', 25, yPosition);
      yPosition += 12;

      // Specific Findings Table with adjusted width
      doc.autoTable({
        startY: yPosition,
        head: [['Location', 'Finding']],
        body: [
          ['Right Upper Lobe', 'Patchy, nodular opacities with increased density'],
          ['Left Upper Lobe', 'Small, thin-walled cavitary lesion (~1.2 cm)'],
          ['Hilar Regions', 'Bilateral hilar lymphadenopathy; nodes enlarged to ~2 cm'],
          ['Pleural Spaces', 'No significant pleural effusion or pneumothorax'],
          ['Other', 'No miliary pattern; lung bases clear; cardiac silhouette normal']
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [0, 0, 128],
          fontSize: 10,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        margin: { left: 25, right: 25 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 'auto' }
        }
      });
      yPosition = doc.lastAutoTable.finalY + 12;

      // III. Image Analysis
      yPosition = addSectionHeader('III. Image Analysis', yPosition);
      
      // Add the three images side by side with adjusted dimensions
      if (imageData?.preview) {
        const imgWidth = (pageWidth - 70) / 3;
        const imgHeight = 35;
        
        // Add images with proper spacing
        doc.addImage(imageData.preview, 'JPEG', 25, yPosition, imgWidth, imgHeight);
        doc.addImage(imageData.preview, 'JPEG', 25 + imgWidth + 5, yPosition, imgWidth, imgHeight);
        doc.addImage(imageData.preview, 'JPEG', 25 + (imgWidth + 5) * 2, yPosition, imgWidth, imgHeight);
        
        yPosition += imgHeight + 4;
        
        // Image labels with adjusted positioning
        doc.setFontSize(8);
        doc.text('Original X-ray', 25 + imgWidth/2, yPosition, { align: 'center' });
        doc.text('Segmentation Overlay', 25 + imgWidth * 1.5 + 5, yPosition, { align: 'center' });
        doc.text('3D Reconstruction', 25 + imgWidth * 2.5 + 10, yPosition, { align: 'center' });
        yPosition += 12;
      }

      // Check if we need a new page for Key Point box
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Key Point box with gradient background
      doc.setDrawColor(0, 0, 128);
      doc.setFillColor(240, 240, 255);
      doc.roundedRect(25, yPosition, pageWidth - 50, 22, 2, 2, 'FD');
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 128);
      doc.text('Key Point:', 30, yPosition);
      yPosition += 5;
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      const keyPointText = 'A chest X-ray can raise strong suspicion for TB but cannot confirm diagnosis—combine with microbiology and clinical assessment before treatment decisions.';
      const lines = doc.splitTextToSize(keyPointText, pageWidth - 60);
      doc.text(lines, 30, yPosition);      // Footer with border line
      doc.setDrawColor(0, 0, 128);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 40, pageWidth - 20, pageHeight - 40);
      
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text('Generated by TB Screening System', pageWidth / 2, pageHeight - 33, { align: 'center' });
      
      // Add additional footer text
      doc.text('Software is for binary TB detection only (colour-coded by severity).', pageWidth / 2, pageHeight - 27, { align: 'center' });
      doc.text('Confirm with a physician.', pageWidth / 2, pageHeight - 23, { align: 'center' });
      doc.text('© 2025 PIVOTAL TELERADIOLOGY LLP. All rights reserved.', pageWidth / 2, pageHeight - 19, { align: 'center' });
      
      // Add footer links text
      doc.text('Terms & Conditions | Privacy Policy | Disclaimer', pageWidth / 2, pageHeight - 13, { align: 'center' });
      
      doc.text('Page 1', pageWidth - 25, pageHeight - 8);

      // Wait for progress to complete
      await new Promise((resolve) => setTimeout(resolve, 3000));
      clearInterval(interval);
      doc.save('tb_screening_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Error generating PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4, position: 'relative' }}>
          {/* Header with Logo */}
          <Box 
  sx={{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    pb: 2,
    borderBottom: '2px solid #000080',
    mb: 4
  }}
>
  <img 
    src={IconImage} 
    alt="Logo" 
    style={{ width: 190, height: 80, marginBottom: -1 }} 
  />
  <Typography 
    variant="h3" 
    color="primary" 
    sx={{ 
      fontWeight: 'bold',
      color: '#000080',
      textAlign: 'center'
    }}
  >
    TB Screening Report
  </Typography>
</Box>


          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Patient Information Box */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: '#f0f0ff',
              border: '1px solid #000080',
              borderRadius: 2
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Patient Name:</strong> {patientData?.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Age / Sex:</strong> {calculateAge(patientData?.date_of_birth)} / {patientData?.gender}
                </Typography>
                <Typography variant="body1">
                  <strong>Facility:</strong> Example General Hospital
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" align="right">
                  <strong>Patient ID:</strong> {patientData?.uid}
                </Typography>
                <Typography variant="body1" align="right">
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* TB Confidence Score */}
          <Box sx={{ mb: 4, pl: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              TB Detection Confidence
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <Box sx={{ 
                  width: '100%', 
                  height: 10, 
                  bgcolor: '#e0e0e0',
                  borderRadius: 1,
                  position: 'relative'
                }}>
                  <Box sx={{
                    width: `${tbConfidence}%`,
                    height: '100%',
                    bgcolor: '#000080',
                    borderRadius: 1,
                    transition: 'width 1s ease-in-out',
                  }} />
                </Box>
              </Box>
              <Typography variant="h6" color="primary">
                {tbConfidence}%
              </Typography>
            </Box>
          </Box>          {generatingPDF ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" my={4}>
              <CircularProgress size={60} thickness={4} color="primary" value={pdfProgress} variant="determinate" />
              <Typography variant="h6" color="primary" mt={2}>
                Generating PDF...
              </Typography>
            </Box>
          ) : (
            <>
              {/* X-Ray Details Section */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#000080',
                    fontWeight: 'bold',
                    pb: 1,
                    borderBottom: '1px solid #000080',
                    mb: 2
                  }}
                >
                  I. X-Ray Details
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>View:</strong> Posteroanterior (PA)
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Date:</strong> {new Date().toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Technician:</strong> A. Smith, RT(R)
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Reporting Radiologist:</strong> Dr. Jane Patel, MD
                  </Typography>
                </Box>
              </Box>

              {/* Radiology Report Section */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#000080',
                    fontWeight: 'bold',
                    pb: 1,
                    borderBottom: '1px solid #000080',
                    mb: 2
                  }}
                >
                  II. Radiology Report
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ pl: 2 }}>
                  Overall Impression
                </Typography>
                <Typography variant="body1" sx={{ pl: 2, mb: 3 }}>
                  Findings are <strong>suggestive of active pulmonary tuberculosis</strong>.
                </Typography>

                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#000080' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Finding</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Right Upper Lobe</TableCell>
                        <TableCell>Patchy, nodular opacities with increased density</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Left Upper Lobe</TableCell>
                        <TableCell>Small, thin-walled cavitary lesion (~1.2 cm)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hilar Regions</TableCell>
                        <TableCell>Bilateral hilar lymphadenopathy; nodes enlarged to ~2 cm</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pleural Spaces</TableCell>
                        <TableCell>No significant pleural effusion or pneumothorax</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other</TableCell>
                        <TableCell>No miliary pattern; lung bases clear; cardiac silhouette normal</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Image Analysis Section */}
              <Box sx={{ mb: 4}}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#000080',
                    fontWeight: 'bold',
                    pb: 1,
                    borderBottom: '1px solid #000080',
                    mb: 2
                  }}
                >
                  III. Image Analysis
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
                  {imageData?.preview && (
                    <>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <img
                            src={imageData.preview}
                            alt="Original X-ray"
                            style={{ 
                              width: '100%', 
                              height: 'auto',
                              maxHeight: 200,
                              objectFit: 'contain',
                              marginBottom: 8
                            }}
                          />
                          <Typography variant="body2">Original X-ray</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <img
                            src={imageData.preview}
                            alt="Segmentation Overlay"
                            style={{ 
                              width: '100%', 
                              height: 'auto',
                              maxHeight: 200,
                              objectFit: 'contain',
                              marginBottom: 8
                            }}
                          />
                          <Typography variant="body2">Segmentation Overlay</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <img
                            src={imageData.preview}
                            alt="3D Reconstruction"
                            style={{ 
                              width: '100%', 
                              height: 'auto',
                              maxHeight: 200,
                              objectFit: 'contain',
                              marginBottom: 8
                            }}
                          />
                          <Typography variant="body2">3D Reconstruction</Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>

              {/* Key Point Box */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  backgroundColor: '#f0f0ff',
                  border: '1px solid #000080',
                  borderRadius: 2
                }}
              >
                <Typography 
                  variant="h6" 
                  color="primary" 
                  gutterBottom
                  sx={{ color: '#000080' }}
                >
                  Key Point:
                </Typography>
                <Typography>
                  A chest X-ray can raise strong suspicion for TB but <strong>cannot</strong> confirm diagnosis—combine with microbiology and clinical assessment before treatment decisions.
                </Typography>
              </Paper>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleGeneratePDF}
                >
                  Generate PDF Report
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => alert("Email functionality will be implemented in a future update.")}
                >
                  Email PDF
                </Button>
              </Box>
            </>
          )}
        </Paper>

        {/* Footer */}        <Box 
          sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '2px solid #000080',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#808080'
          }}
        >
          {/* <Typography variant="body2">
            Generated by TB Screening System
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Software is for binary TB detection only (colour-coded by severity).
            Confirm with a physician.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 PIVOTAL TELERADIOLOGY LLP. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            <Button color="inherit" size="small">Terms & Conditions</Button>
            {' | '}
            <Button color="inherit" size="small">Privacy Policy</Button>
            {' | '}
            <Button color="inherit" size="small">Disclaimer</Button>
          </Typography>
          <Typography variant="body2" sx={{ alignSelf: 'flex-end' }}>
            Page 1
          </Typography> */}
        </Box>

        <Dialog
          open={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
        >
          <DialogTitle>Secure Your Report</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This password will be required to open the PDF. Please make sure to remember it
              or share it securely with the intended recipients.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="PDF Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(!password && error)}
              helperText={!password && error ? error : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button
              onClick={handleDownloadPDF}
              variant="contained"
              disabled={!password}
            >
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}

export default Report;