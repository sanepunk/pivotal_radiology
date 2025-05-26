import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import SignIn from './pages/SignIn';
import Welcome from './pages/Welcome';
import PatientForm from './pages/PatientForm';
import PatientHistory from './pages/PatientHistory';
import ImageUpload from './pages/ImageUpload';
import Visualization from './pages/Visualization';
import Report from './pages/Report';

const queryClient = new QueryClient();

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/patient/new" element={<PatientForm />} />
            <Route path="/patient/history" element={<PatientHistory />} />
            <Route path="/upload" element={<ImageUpload />} />
            <Route path="/visualize" element={<Visualization />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
