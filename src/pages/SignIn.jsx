import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  Tab,
  Tabs,
  MenuItem,
} from '@mui/material';
import { authAPI } from '../services/api';

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const registerValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(['doctor', 'admin'], 'Invalid role')
    .required('Role is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      'Password must contain letters, numbers, and special characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function SignIn() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login({
        email: values.email,
        password: values.password,
      });
      console.log('Login response:', response.data);
      const { access_token, token_type } = response.data;
      const fullToken = `${token_type} ${access_token}`;
      console.log('Storing token:', fullToken);
      localStorage.setItem('token', fullToken);
      navigate('/welcome');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleRegister = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');
    try {
      await authAPI.register({
        name: values.name,
        email: values.email,
        role: values.role,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setMode('login');
      setError('Registration successful! Please login.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          TB Screening Portal
        </Typography>

        <Tabs
          value={mode}
          onChange={(_, newValue) => {
            setMode(newValue);
            setError('');
          }}
          sx={{ mb: 3 }}
        >
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>

        {error && (
          <Alert 
            severity={error.includes('successful') ? 'success' : 'error'} 
            sx={{ width: '100%', mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {mode === 'login' ? (
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Box sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting || loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              name: '',
              email: '',
              role: 'doctor',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleRegister}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Box sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoFocus
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    select
                    id="role"
                    label="Role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.role && Boolean(errors.role)}
                    helperText={touched.role && errors.role}
                  >
                    <MenuItem value="doctor">Doctor</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting || loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </Container>
  );
}

export default SignIn; 