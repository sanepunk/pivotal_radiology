import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
} from '@mui/material';
import {
  ThreeDRotation,
  ZoomIn,
  ZoomOut,
  Visibility,
  VisibilityOff,
  Thermostat,
} from '@mui/icons-material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Layout from '../components/Layout';
import LoadingTips from '../components/LoadingTips';

function Box3D({ position = [0, 0, 0], color = 'navy' }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Visualization() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData, imageData, diagnosis } = location.state || {};

  const [viewMode, setViewMode] = useState('original'); // 'original', 'segmentation', '3d'
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showLeftLobe, setShowLeftLobe] = useState(true);
  const [showRightLobe, setShowRightLobe] = useState(true);
  const [thermalView, setThermalView] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    // Simulate analysis progress
    if (analyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setAnalyzing(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [analyzing]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleRotationChange = (event, newValue) => {
    setRotation(newValue);
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  const handleGenerateReport = () => {
    navigate('/report', {
      state: {
        patientData,
        imageData,
        diagnosis,
        visualizationData: {
          viewMode,
          rotation,
          zoom,
          thermalView,
        },
      },
    });
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Analysis Results
          </Typography>

          {patientData && (
            <Typography variant="subtitle1" gutterBottom>
              Patient: {patientData.name} (UID: {patientData.uid})
            </Typography>
          )}

          {analyzing ? (
            <LoadingTips progress={analysisProgress} />
          ) : (
            <>
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: diagnosis?.result === 'malignant' ? '#ffebee' : '#e8f5e9',
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5" align="center" gutterBottom>
                  Diagnosis: {diagnosis?.result.toUpperCase()?? "TB POSITIVE"}
                </Typography>
                <Typography variant="body1" align="center">
                  Confidence: {((diagnosis?.confidence?? 0.95) * 100).toFixed(1)}%
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={2}
                    sx={{
                      height: 500,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {viewMode === '3d' ? (
                      <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        {showLeftLobe && <Box3D position={[-1, 0, 0]} />}
                        {showRightLobe && <Box3D position={[1, 0, 0]} />}
                        <OrbitControls />
                      </Canvas>
                    ) : (
                      <img
                        src={imageData?.preview}
                        alt="Medical scan"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          transform: `rotate(${rotation}deg) scale(${zoom})`,
                          filter: thermalView ? 'hue-rotate(180deg)' : 'none',
                        }}
                      />
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Visualization Controls
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>View Mode</Typography>
                      <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                        fullWidth
                      >
                        <ToggleButton value="original">Original</ToggleButton>
                        <ToggleButton value="segmentation">Segmentation</ToggleButton>
                        <ToggleButton value="3d">3D View</ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Rotation</Typography>
                      <Slider
                        value={rotation}
                        onChange={handleRotationChange}
                        min={-180}
                        max={180}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}°`}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Zoom</Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <ZoomOut />
                        </Grid>
                        <Grid item xs>
                          <Slider
                            value={zoom}
                            onChange={handleZoomChange}
                            min={0.5}
                            max={3}
                            step={0.1}
                            valueLabelDisplay="auto"
                          />
                        </Grid>
                        <Grid item>
                          <ZoomIn />
                        </Grid>
                      </Grid>
                    </Box>

                    {viewMode === '3d' && (
                      <>
                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant={showLeftLobe ? 'contained' : 'outlined'}
                            startIcon={showLeftLobe ? <Visibility /> : <VisibilityOff />}
                            onClick={() => setShowLeftLobe(!showLeftLobe)}
                            fullWidth
                          >
                            Left Lobe
                          </Button>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant={showRightLobe ? 'contained' : 'outlined'}
                            startIcon={showRightLobe ? <Visibility /> : <VisibilityOff />}
                            onClick={() => setShowRightLobe(!showRightLobe)}
                            fullWidth
                          >
                            Right Lobe
                          </Button>
                        </Box>
                      </>
                    )}

                    <Box sx={{ mb: 3 }}>
                      <Button
                        variant={thermalView ? 'contained' : 'outlined'}
                        startIcon={<Thermostat />}
                        onClick={() => setThermalView(!thermalView)}
                        fullWidth
                      >
                        Thermal View
                      </Button>
                    </Box>
                  </Paper>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleGenerateReport}
                    sx={{ mt: 2 }}
                  >
                    Generate Report
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Container>
    </Layout>
  );
}

export default Visualization; 