import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';

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
import LandingPage from './pages/LandingPage';
import DoctorRegisterSuccess from './pages/DoctorRegisterSuccess';
import PatientRegisterSuccess from './pages/PatientRegisterSuccess';

// Layout Component
const Layout = ({ children }) => {
  return (
    <Container maxWidth={false} disableGutters>
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
    fontFamily: '"Lato", sans-serif',
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightRegular: 500,
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
      fontWeight: 500,
    },
    body2: {
      fontSize: '11pt',
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
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
        <Router basename='/app'>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<SignIn />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
