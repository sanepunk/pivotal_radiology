import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
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
import PatientListPage from './pages/PatientListPage';
import PatientDetails from './components/PatientDetails';
import DoctorManagement from './pages/DoctorManagement';
import DoctorRegisterSuccess from './pages/DoctorRegisterSuccess';
import PatientRegisterSuccess from './pages/PatientRegisterSuccess';

// Layout Component
const Layout = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
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
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Times New Roman',
    body1: {
      fontSize: '12pt',
    },
    h4: {
      fontSize: '16pt',
    },
    h2: {
      fontSize: '20pt',
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

// Background wrapper component
const BackgroundWrapper = ({ children, showBackground = true }) => {
  return (
    <Container maxWidth={false} disableGutters sx={{ margin: 0, padding: 0 }}>
      {showBackground && (
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BackgroundWrapper>
          <Router>
            <Routes>              <Route path="/" element={<SignIn />} />
              <Route path="/doctor-register-success" element={<DoctorRegisterSuccess />} />
              <Route path="/patient-register-success" element={<PatientRegisterSuccess />} />
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
              path="/doctors"
              element={
                <ProtectedRoute adminOnly={true}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />          </Routes>
          </Router>
        </BackgroundWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
