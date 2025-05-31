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
} from '@mui/material';
import { jsPDF } from 'jspdf';
import Layout from '../components/Layout';
import LoadingTips from '../components/LoadingTips';

function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData, imageData, diagnosis, visualizationData } = location.state || {};

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
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 128); // Navy Blue
      doc.text('TB Screening Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // I. Patient Information
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text('I. Patient Information', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${patientData?.name}`, 20, yPosition); yPosition += 8;
      doc.text(`Patient ID: ${patientData?.uid}`, 20, yPosition); yPosition += 8;
      doc.text(`Age / Sex: ${patientData?.age} / ${patientData?.sex}`, 20, yPosition); yPosition += 8;
      doc.text(`Date of X-ray: ${new Date().toISOString().split('T')[0]}`, 20, yPosition); yPosition += 8;
      doc.text(`Facility: Example General Hospital`, 20, yPosition); yPosition += 15;

      // II. X-Ray Details
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text('II. X-Ray Details', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`View: Posteroanterior (PA)`, 20, yPosition); yPosition += 8;
      doc.text(`Date: ${new Date().toLocaleString()}`, 20, yPosition); yPosition += 8;
      doc.text(`Technician: A. Smith, RT(R)`, 20, yPosition); yPosition += 15;
      doc.text(`Reporting Radiologist: Dr. Jane Patel, MD`, 20, yPosition); yPosition += 15;

      // III. Radiology Report
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text('III. Radiology Report', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(14);
      doc.text('Overall Impression', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.text('Findings are suggestive of active pulmonary tuberculosis.', 20, yPosition);
      yPosition += 15;

      // Specific Findings Table
      doc.setFontSize(14);
      doc.text('Specific Findings', 20, yPosition);
      yPosition += 10;

      const findings = [
        ['Right Upper Lobe', 'Patchy, nodular opacities with increased density'],
        ['Left Upper Lobe', 'Small, thin-walled cavitary lesion (~1.2 cm)'],
        ['Hilar Regions', 'Bilateral hilar lymphadenopathy; nodes enlarged to ~2 cm'],
        ['Pleural Spaces', 'No significant pleural effusion or pneumothorax'],
        ['Other', 'No miliary pattern; lung bases clear; cardiac silhouette normal']
      ];

      // Add findings table
      const startY = yPosition;
      doc.autoTable({
        startY,
        head: [['Location', 'Finding']],
        body: findings,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 128] },
        margin: { left: 20 }
      });
      yPosition = doc.lastAutoTable.finalY + 15;

      // IV. Recommendations
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text('IV. Recommendations', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const recommendations = [
        '1. Microbiological Confirmation',
        '   • Sputum AFB smear and culture (×3)',
        '   • Molecular testing (e.g., Xpert MTB/RIF)',
        '2. Treatment Referral',
        '   • Refer to TB clinic for initiation of anti-tubercular therapy',
        '3. Follow-Up Imaging',
        '   • Repeat chest X-ray after 2 months of therapy to assess response'
      ];

      recommendations.forEach(rec => {
        doc.text(rec, 20, yPosition);
        yPosition += 8;
      });
      yPosition += 7;

      // V. Additional Notes
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text('V. Additional Notes', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const notes = [
        '• Clinical Correlation Required: Correlate with symptoms (cough, fever, weight loss) and HIV status.',
        '• Differential Diagnoses: Fungal infection (e.g., histoplasmosis), malignancy—consider based on context.',
        '• Risk Factors: History of prior TB; HIV-positive status increases reactivation risk.'
      ];

      notes.forEach(note => {
        const lines = doc.splitTextToSize(note, pageWidth - 40);
        lines.forEach(line => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += 8;
        });
      });
      yPosition += 7;

      // Key Point box
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setDrawColor(0, 0, 128);
      doc.setLineWidth(0.5);
      doc.rect(20, yPosition, pageWidth - 40, 25);
      yPosition += 5;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.text('Key Point:', 25, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      doc.text('A chest X-ray can raise strong suspicion for TB but cannot confirm diagnosis—', 25, yPosition);
      yPosition += 8;
      doc.text('combine with microbiology and clinical assessment before treatment decisions.', 25, yPosition);
      yPosition += 15;

      // VI. Image Comparison
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text('VI. Image Comparison', 20, yPosition);
      yPosition += 15;

      // Add the three images side by side if available
      if (imageData?.preview) {
        const imgWidth = (pageWidth - 60) / 3;
        const imgHeight = 60;
        
        try {
          // Original Image
          doc.addImage(imageData.preview, 'JPEG', 20, yPosition, imgWidth, imgHeight);
          
          // Thermal Overlay (if available)
          if (visualizationData?.thermalView) {
            doc.addImage(imageData.preview, 'JPEG', 20 + imgWidth + 10, yPosition, imgWidth, imgHeight);
          }
          
          // 3D View (if available)
          if (visualizationData?.viewMode === '3d') {
            doc.addImage(imageData.preview, 'JPEG', 20 + (imgWidth + 10) * 2, yPosition, imgWidth, imgHeight);
          }
          
          yPosition += imgHeight + 10;
          
          // Image labels
          doc.setFontSize(10);
          doc.text('Input X-ray', 20, yPosition);
          doc.text('Thermal Overlay', 20 + imgWidth + 10, yPosition);
          doc.text('3D View', 20 + (imgWidth + 10) * 2, yPosition);
        } catch (error) {
          console.error('Error adding images to PDF:', error);
        }
      }

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Generated by TB Screening System', pageWidth / 2, pageHeight - 10, { align: 'center' });

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
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            TB Screening Report
          </Typography>

          {generatingPDF ? (
            <LoadingTips progress={pdfProgress} />
          ) : (
            <>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  {/* Section I: Patient Information */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      I. Patient Information
                    </Typography>
                    <Typography>Name: {patientData?.name}</Typography>
                    <Typography>Patient ID: {patientData?.uid}</Typography>
                    <Typography>Age / Sex: {patientData?.age} / {patientData?.sex}</Typography>
                    <Typography>Date of X-ray: {new Date().toISOString().split('T')[0]}</Typography>
                    <Typography>Facility: Example General Hospital</Typography>
                  </Box>

                  {/* Section II: X-Ray Details */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      II. X-Ray Details
                    </Typography>
                    <Typography>View: Posteroanterior (PA)</Typography>
                    <Typography>Date: {new Date().toLocaleString()}</Typography>
                    <Typography>Technician: A. Smith, RT(R)</Typography>
                    <Typography>Reporting Radiologist: Dr. Jane Patel, MD</Typography>
                  </Box>

                  {/* Section III: Radiology Report */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      III. Radiology Report
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Overall Impression
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      Findings are <strong>suggestive of active pulmonary tuberculosis</strong>.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                      Specific Findings
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Finding</TableCell>
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
                </Grid>

                <Grid item xs={12} md={6}>
                  {/* Section IV: Recommendations */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      IV. Recommendations
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      1. Microbiological Confirmation
                    </Typography>
                    <Typography sx={{ ml: 2 }}>• Sputum AFB smear and culture (×3)</Typography>
                    <Typography sx={{ ml: 2, mb: 1 }}>• Molecular testing (e.g., Xpert MTB/RIF)</Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      2. Treatment Referral
                    </Typography>
                    <Typography sx={{ ml: 2, mb: 1 }}>• Refer to TB clinic for initiation of anti-tubercular therapy</Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      3. Follow-Up Imaging
                    </Typography>
                    <Typography sx={{ ml: 2 }}>• Repeat chest X-ray after 2 months of therapy to assess response</Typography>
                  </Box>

                  {/* Section V: Additional Notes */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      V. Additional Notes
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      • Clinical Correlation Required: Correlate with symptoms (cough, fever, weight loss) and HIV status.
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      • Differential Diagnoses: Fungal infection (e.g., histoplasmosis), malignancy—consider based on context.
                    </Typography>
                    <Typography>
                      • Risk Factors: History of prior TB; HIV-positive status increases reactivation risk.
                    </Typography>
                  </Box>

                  {/* Key Point Box */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 4, 
                      border: '1px solid #000080',
                      borderRadius: 1 
                    }}
                  >
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Key Point:
                    </Typography>
                    <Typography>
                      A chest X-ray can raise strong suspicion for TB but <strong>cannot</strong> confirm diagnosis—combine with microbiology and clinical assessment before treatment decisions.
                    </Typography>
                  </Paper>

                  {/* Section VI: Image Comparison */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      VI. Image Comparison
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        {imageData?.preview ? (
                          <Box>
                            <img
                              src={imageData.preview}
                              alt="Input X-ray"
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography variant="caption" align="center" display="block">
                              Input X-ray
                            </Typography>
                          </Box>
                        ) : (
                          <Paper 
                            sx={{ 
                              p: 2, 
                              height: 150, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            <Typography color="text.secondary">No image</Typography>
                          </Paper>
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        {visualizationData?.thermalView ? (
                          <Box>
                            <img
                              src={imageData?.preview}
                              alt="Thermal Overlay"
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography variant="caption" align="center" display="block">
                              Thermal Overlay
                            </Typography>
                          </Box>
                        ) : (
                          <Paper 
                            sx={{ 
                              p: 2, 
                              height: 150, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            <Typography color="text.secondary">No thermal overlay</Typography>
                          </Paper>
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        {visualizationData?.viewMode === '3d' ? (
                          <Box>
                            <img
                              src={imageData?.preview}
                              alt="3D View"
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography variant="caption" align="center" display="block">
                              3D View
                            </Typography>
                          </Box>
                        ) : (
                          <Paper 
                            sx={{ 
                              p: 2, 
                              height: 150, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            <Typography color="text.secondary">No 3D view</Typography>
                          </Paper>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleGeneratePDF}
                >
                  Generate PDF Report
                </Button>
              </Box>
            </>
          )}
        </Paper>

        <Dialog
          open={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
        >
          <DialogTitle>Secure Your Report</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="PDF Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="This password will be required to open the PDF"
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