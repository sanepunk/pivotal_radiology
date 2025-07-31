import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import lungImage from './assets/background.jpg';

// Pages
import SignIn from './pages/SignIn';
import Welcome from './pages/Welcome';
import PatientForm from './pages/PatientForm';
import PatientHistory from './pages/PatientHistory';
import ImageUpload from './pages/ImageUpload';
import Visualization from './pages/Visualization';
import Report from './pages/Report';
import PatientRegistration from './pages/PatientRegistration';
import VTK3DViewer from './pages/VTK3DViewer';
import PatientListPage from './pages/PatientListPage';
import PatientDetails from './components/PatientDetails';
import DoctorManagement from './pages/DoctorManagement';
import LandingPage from './pages/LandingPage';
import DoctorRegisterSuccess from './pages/DoctorRegisterSuccess';
import PatientRegisterSuccess from './pages/PatientRegisterSuccess';
import LungBackground from './components/LungBackground';
import TestBackground from './pages/TestBackground';

// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Skip background for landing page, report page, and PDF page
  const excludedPaths = ['/', '/report', '/pdf'];
  const shouldShowBackground = !excludedPaths.some(excludedPath => 
    path === excludedPath || path === excludedPath + '/'
  );

  return (
    <Container maxWidth={false} disableGutters sx={{ margin: 0, padding: 0 }}>
      {shouldShowBackground && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            backgroundImage: `url(${lungImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      <Box sx={{ position: 'relative', zIndex: 1, margin: 0, padding: 0 }}>
        {children}
      </Box>
    </Container>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#000080', // Navy Blue
      dark: '#000066', // Darker navy for hover states
      contrastText: '#ffffff', // White text for better contrast
    },
    secondary: {
      main: '#1976d2', // Blue accent color
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 128, 0.25)',
          backgroundImage: 'linear-gradient(45deg, #000080 30%, #0d47a1 90%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Lato", sans-serif',
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightRegular: 700,
    h1: {
      fontSize: '26pt',
      fontWeight: 700,
    },
    h2: {
      fontSize: '24pt',
      fontWeight: 700,
    },
    h3: {
      fontSize: '22pt',
      fontWeight: 700,
    },
    h4: {
      fontSize: '20pt',
      fontWeight: 700,
    },
    h5: {
      fontSize: '18pt',
      fontWeight: 700,
    },
    h6: {
      fontSize: '16pt',
      fontWeight: 700,
    },
    body1: {
      fontSize: '12pt',
      fontWeight: 700,
    },
    body2: {
      fontSize: '11pt',
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 700,
    },
    subtitle2: {
      fontWeight: 700,
    },
    caption: {
      fontWeight: 700,
    },
    overline: {
      fontWeight: 700,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/welcome" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            '*': {
              fontWeight: 700,
            },
            '.MuiTypography-root': {
              fontWeight: '700 !important',
            },
            '.MuiButton-root': {
              fontWeight: '700 !important',
            },
            '.MuiInputBase-root, .MuiInputLabel-root, .MuiFormLabel-root, .MuiMenuItem-root, .MuiListItemText-primary, .MuiChip-label': {
              fontWeight: '700 !important',
            },
            'p, span, div, h1, h2, h3, h4, h5, h6, button, a, li': {
              fontWeight: '700 !important',
            },
            '.MuiAlert-message, .MuiSnackbarContent-message, .MuiTooltip-tooltip, .MuiDialog-paper, .MuiTableCell-root, .MuiAccordionSummary-content, .MuiAccordionDetails-root': {
              fontWeight: '700 !important',
            },
            '.MuiTableHead-root .MuiTableCell-root, .MuiCardContent-root, .MuiCardHeader-root, .MuiCardActions-root': {
              fontWeight: '700 !important',
            },
            '.MuiTabs-root, .MuiTab-root, .MuiStepLabel-label, .MuiBreadcrumbs-root, .MuiTimeline-root': {
              fontWeight: '700 !important',
            },
            '.MuiOutlinedInput-input, .MuiFilledInput-input, .MuiInput-input': {
              fontWeight: '700 !important',
            }
          }}
        />
        <Box sx={{ 
          margin: 0, 
          padding: 0, 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Router basename='/app'>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<SignIn />} />
              <Route path="/doctor-register-success" element={<DoctorRegisterSuccess />} />
              <Route path="/patient-register-success" element={<PatientRegisterSuccess />} />
              <Route path="/test-background" element={<TestBackground />} />
              <Route
                path="/welcome"
                element={
                  <ProtectedRoute>
                    <Welcome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <PatientListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/register"
                element={
                  <ProtectedRoute>
                    <PatientRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:uid/history"
                element={
                  <ProtectedRoute>
                    <PatientHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientUid"
                element={
                  <ProtectedRoute>
                    <PatientDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientUid/edit"
                element={
                  <ProtectedRoute>
                    <PatientForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <ImageUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/visualize"
                element={
                  <ProtectedRoute>
                    <Visualization />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vtk-viewer"
                element={
                  <ProtectedRoute>
                    <VTK3DViewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <DoctorManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
