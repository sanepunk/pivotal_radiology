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
  Chip,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Layout from '../components/Layout';
import IconImage from '../assets/Icon.png';
import { calculateAge } from '../utils/dateUtils';
import api from '../services/api';

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
  const [loadedImages, setLoadedImages] = useState({});

  // Extract TB prediction from imageData if available
  const tbPrediction = imageData?.tb_prediction || null;

  // Function to convert an image to base64 when it loads
  const handleImageLoad = (imageKey, imgElement) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }
      ctx.drawImage(imgElement, 0, 0);
      try {
        const dataURL = canvas.toDataURL('image/png');
        setLoadedImages(prev => ({ ...prev, [imageKey]: dataURL }));
      } catch (e) {
        console.error('Error converting to data URL:', e);
        // Try with JPEG if PNG fails
        try {
          const dataURL = canvas.toDataURL('image/jpeg', 0.9);
          setLoadedImages(prev => ({ ...prev, [imageKey]: dataURL }));
        } catch (e2) {
          console.error('Error converting to JPEG:', e2);
        }
      }
    } catch (error) {
      console.error('Error in handleImageLoad:', error);
    }
  };

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

    // Wait for React to finish rendering and images to load
    await new Promise(resolve => setTimeout(resolve, 2000));

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

      // Patient Information Box
      doc.setDrawColor(0, 0, 128);
      doc.setFillColor(240, 240, 255);
      doc.roundedRect(20, yPosition, pageWidth - 40, 35, 2, 2, 'FD');
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      
      // Left side information
      doc.text('Patient Name: ' + (patientData?.name || 'N/A'), 25, yPosition + 10);
      doc.text('Age / Sex: ' + calculateAge(patientData?.date_of_birth) + ' / ' + (patientData?.gender || 'N/A'), 25, yPosition + 20);
      doc.text('Facility: Example General Hospital', 25, yPosition + 30);
      
      // Right side information
      doc.text('Patient ID: ' + (patientData?.uid || 'N/A'), pageWidth - 25, yPosition + 10, { align: 'right' });
      doc.text('Date: ' + new Date().toLocaleDateString(), pageWidth - 25, yPosition + 20, { align: 'right' });
      yPosition += 45;

      // TB Analysis Results
      if (tbPrediction) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 128);
        doc.setFont(undefined, 'bold');
        doc.text('TB Analysis Results', 25, yPosition);
        yPosition += 10;

        // Add border line under the heading
        doc.setDrawColor(0, 0, 128);
        doc.setLineWidth(0.5);
        doc.line(25, yPosition, 200, yPosition);
        yPosition += 10;

        // Prediction Result
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.text('Prediction:', 30, yPosition);
        
        // Add colored rectangle for prediction
        const predictionText = tbPrediction.result;
        const textWidth = doc.getTextWidth('Prediction: ');
        doc.setFillColor(tbPrediction.result === 'TB Positive' ? 255 : 200, 
                        tbPrediction.result === 'TB Positive' ? 200 : 255, 
                        200);
        doc.setDrawColor(tbPrediction.result === 'TB Positive' ? 255 : 0, 
                        0, 
                        0);
        doc.roundedRect(30 + textWidth, yPosition - 5, doc.getTextWidth(predictionText) + 10, 7, 1, 1, 'FD');
        doc.text(predictionText, 30 + textWidth + 5, yPosition);
        yPosition += 15;

        // TB Detection Confidence
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 128);
        doc.setFont(undefined, 'bold');
        doc.text('TB Detection Confidence', 30, yPosition);
        yPosition += 10;

        // Progress bar
        const barWidth = 150;
        const barHeight = 8;
        const startX = 30;
        
        // Background bar
        doc.setDrawColor(224, 224, 224);
        doc.setFillColor(224, 224, 224);
      doc.roundedRect(startX, yPosition - 4, barWidth, barHeight, 1, 1, 'F');
      
        // Filled portion
      doc.setDrawColor(0, 0, 128);
      doc.setFillColor(0, 0, 128);
        doc.roundedRect(startX, yPosition - 4, (tbPrediction.confidence * 100 / 100) * barWidth, barHeight, 1, 1, 'F');
        
        // Percentage text
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 128);
        doc.text((tbPrediction.confidence * 100).toFixed(1) + '%', startX + barWidth + 10, yPosition + 2);
      yPosition += 20;
      }

      // Section Headers Style
      const addSectionHeader = (text, y) => {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 128);
        doc.setFont(undefined, 'bold');
        doc.text(text, 25, y);
        doc.setLineWidth(0.5);
        doc.line(25, y + 2, pageWidth - 25, y + 2);
        return y + 15;
      };

      // I. X-Ray Details
      yPosition = addSectionHeader('I. X-Ray Details', yPosition);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      
      // Add indentation and consistent spacing
      const detailsX = 30;
      doc.text(`View: Posteroanterior (PA)`, detailsX, yPosition); yPosition += 8;
      doc.text(`Date: ${new Date().toLocaleString()}`, detailsX, yPosition); yPosition += 8;
      doc.text(`Technician: A. Smith, RT(R)`, detailsX, yPosition); yPosition += 8;
      doc.text(`Reporting Radiologist: Dr. Jane Patel, MD`, detailsX, yPosition); yPosition += 20;

      // II. Radiology Report
      yPosition = addSectionHeader('II. Radiology Report', yPosition);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Overall Impression', detailsX, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('Findings are suggestive of active pulmonary tuberculosis.', detailsX, yPosition);
      yPosition += 15;

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
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'left',
          cellPadding: 8
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 8,
          textColor: [0, 0, 0]
        },
        margin: { left: detailsX, right: detailsX },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        }
      });
      yPosition = doc.lastAutoTable.finalY + 12;

      // III. Image Analysis
      yPosition = addSectionHeader('III. Image Analysis', yPosition);
      
      // Add the images side by side with adjusted dimensions
      if (imageData?.preview) {
        const isPositive = tbPrediction?.result === 'TB Positive';
        const imgWidth = isPositive ? (pageWidth - 70) / 4 : 60; // Fixed width for single image
        const imgHeight = 35;
        
        // Function to convert image URL to base64
        // Check if we have all required images
        const checkImagesLoaded = () => {
          const requiredImages = ['original'];
          if (tbPrediction?.result === 'TB Positive') {
            // Only add required images if they actually exist in imageData
            if (imageData.segmentation_mask) requiredImages.push('segmentation');
            if (imageData.heatmap_overlay) requiredImages.push('heatmap');
            if (imageData.rendering_png) requiredImages.push('rendering');
          }
          return requiredImages.every(key => loadedImages[key]);
        };

                try {
          // Wait a moment for images to load
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if all required images are loaded
          if (!checkImagesLoaded()) {
            setError('Please wait for all images to load before generating the PDF.');
            clearInterval(interval);
            setGeneratingPDF(false);
            return;
          }

          try {
            if (isPositive) {
              // TB Positive: Multiple images in a row
              doc.addImage(loadedImages.original, 'PNG', 25, yPosition, imgWidth, imgHeight);

              // Segmentation Overlay
              if (loadedImages.segmentation) {
                doc.addImage(loadedImages.segmentation, 'PNG', 25 + imgWidth + 5, yPosition, imgWidth, imgHeight);
              }

              // Heatmap
              if (loadedImages.heatmap) {
                doc.addImage(loadedImages.heatmap, 'PNG', 25 + (imgWidth + 5) * 2, yPosition, imgWidth, imgHeight);
              }

              // 3D Rendering
              if (loadedImages.rendering) {
                doc.addImage(loadedImages.rendering, 'PNG', 25 + (imgWidth + 5) * 3, yPosition, imgWidth, imgHeight);
              }
            } else {
              // TB Negative: Single centered image
              const centerX = (pageWidth - imgWidth) / 2;
              doc.addImage(loadedImages.original, 'PNG', centerX, yPosition, imgWidth, imgHeight);
            }
          } catch (imageError) {
            console.error('Error loading images:', imageError);
            setError('Error loading images for PDF. Please ensure all images are loaded and try again.');
            return;
          }
        } catch (error) {
          console.error('Error in image processing:', error);
          setError('Error processing images for PDF. Please try again.');
          return;
        }
        
        yPosition += imgHeight + 4;
        
                // Image labels with adjusted positioning
        doc.setFontSize(8);
        
        if (isPositive) {
          // TB Positive: Multiple image labels
          doc.text('Original X-ray', 25 + imgWidth/2, yPosition, { align: 'center' });
          if (imageData.segmentation_mask) {
            doc.text('Segmentation Overlay', 25 + imgWidth * 1.5 + 5, yPosition, { align: 'center' });
          }
          if (imageData.heatmap_overlay) {
            doc.text('Heatmap Analysis', 25 + imgWidth * 2.5 + 10, yPosition, { align: 'center' });
          }
          if (imageData.rendering_png) {
            doc.text('3D Analysis', 25 + imgWidth * 3.5 + 15, yPosition, { align: 'center' });
          }
        } else {
          // TB Negative: Single centered label
          const centerX = (pageWidth - imgWidth) / 2;
          doc.text('Original X-ray', centerX + imgWidth/2, yPosition, { align: 'center' });
        }
        yPosition += 12;
      }

      // Check if we need a new page for Key Point box
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Key Point box with matching webpage style
      doc.setDrawColor(0, 0, 128);
      doc.setFillColor(240, 240, 255);
      doc.roundedRect(detailsX, yPosition, pageWidth - (2 * detailsX), 40, 2, 2, 'FD');
      yPosition += 10;
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 128);
      doc.text('Key Point:', detailsX + 5, yPosition);
      yPosition += 8;
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      const keyPointText = 'A chest X-ray can raise strong suspicion for TB but cannot confirm diagnosis—combine with microbiology and clinical assessment before treatment decisions.';
      const lines = doc.splitTextToSize(keyPointText, pageWidth - (2 * detailsX) - 10);
      doc.text(lines, detailsX + 5, yPosition);      // Footer with border line
      doc.setDrawColor(0, 0, 128);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 45, pageWidth - 20, pageHeight - 45);
      
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      
      // Footer text with improved spacing
      const footerY = pageHeight - 35;
      doc.text('Generated by TB Screening System', pageWidth / 2, footerY, { align: 'center' });
      doc.text('Software is for binary TB detection only (colour-coded by severity).', pageWidth / 2, footerY + 6, { align: 'center' });
      doc.text('Confirm with a physician.', pageWidth / 2, footerY + 12, { align: 'center' });
      
      // Copyright text
      doc.setFontSize(9);
      doc.text('© 2025 PIVOTAL TELERADIOLOGY LLP. All rights reserved.', pageWidth / 2, footerY + 18, { align: 'center' });
      
      // Links with underline effect
      const linksText = 'Terms & Conditions | Privacy Policy | Disclaimer';
      const linksWidth = doc.getTextWidth(linksText);
      const linksX = (pageWidth - linksWidth) / 2;
      doc.text(linksText, pageWidth / 2, footerY + 24, { align: 'center' });
      doc.setDrawColor(128, 128, 128);
      doc.setLineWidth(0.2);
      doc.line(linksX, footerY + 25, linksX + linksWidth, footerY + 25);
      
      // Page number
      doc.text('Page 1', pageWidth - 25, footerY + 30);

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

          {/* TB Prediction Section */}
          {tbPrediction && (
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
                TB Analysis Results
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">
                    <strong>Prediction:</strong>
                  </Typography>
                  <Chip
                    label={tbPrediction.result}
                    color={tbPrediction.result === 'TB Positive' ? 'error' : 'success'}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                {/* <Typography variant="body1" gutterBottom>
                  <strong>Confidence:</strong> {tbPrediction.confidence.toFixed(1)}%
                </Typography> */}
              </Box>
            </Box>
          )}

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
                {(tbPrediction.confidence * 100).toFixed(1)}%
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
                <Grid 
                  container 
                  spacing={2} 
                  sx={{ 
                    mb: 2, 
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    minHeight: '250px'
                  }}
                >
                  {imageData?.preview && (
                    tbPrediction?.result === 'TB Positive' ? (
                      <>
                        <Grid item xs={3} sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Box sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                          <img
                            src={imageData.preview}
                            alt="Original X-ray"
                              crossOrigin="anonymous"
                              onLoad={(e) => handleImageLoad('original', e.target)}
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
                        {imageData.segmentation_mask && (
                          <Grid item xs={3} sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Box sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <img
                                src={`http://localhost:8000${imageData.segmentation_mask}`}
                            alt="Segmentation Overlay"
                                crossOrigin="anonymous"
                                onLoad={(e) => handleImageLoad('segmentation', e.target)}
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
                        )}
                        {imageData.heatmap_overlay && (
                          <Grid item xs={3} sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Box sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <img
                                src={`http://localhost:8000${imageData.heatmap_overlay}`}
                                alt="Heatmap"
                                crossOrigin="anonymous"
                                onLoad={(e) => handleImageLoad('heatmap', e.target)}
                                style={{ 
                                  width: '100%', 
                                  height: 'auto',
                                  maxHeight: 200,
                                  objectFit: 'contain',
                                  marginBottom: 8
                                }}
                              />
                              <Typography variant="body2">Heatmap Analysis</Typography>
                            </Box>
                          </Grid>
                        )}
                        {imageData.rendering_png && (
                          <Grid item xs={3} sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Box sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <img
                                src={`http://localhost:8000${imageData.rendering_png}`}
                                alt="3D Analysis"
                                crossOrigin="anonymous"
                                onLoad={(e) => handleImageLoad('rendering', e.target)}
                                style={{ 
                                  width: '95%', 
                                  height: 'auto',
                                  maxHeight: 190,
                                  objectFit: 'contain',
                                  marginBottom: 8,
                                  transform: 'rotate(270deg) scaleX(-1)'
                                }}
                              />
                              <Typography variant="body2">3D Analysis</Typography>
                            </Box>
                          </Grid>
                        )}
                      </>
                    ) : (
                      <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <img
                            src={imageData.preview}
                            alt="Original X-ray"
                            crossOrigin="anonymous"
                            onLoad={(e) => handleImageLoad('original', e.target)}
                            style={{ 
                              width: '100%', 
                              height: 'auto',
                              maxHeight: 300,
                              objectFit: 'contain',
                              marginBottom: 8
                            }}
                          />
                          <Typography variant="body2">Original X-ray</Typography>
                        </Box>
                      </Grid>
                    )
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