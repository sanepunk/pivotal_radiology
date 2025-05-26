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
} from '@mui/material';

const validationSchema = Yup.object({
  loginId: Yup.string().required('Login ID is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      'Password must contain letters, numbers, and special characters'
    )
    .required('Password is required'),
  mobile: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  captcha: Yup.string().required('Captcha is required'),
  otp: Yup.string().when('otpSent', {
    is: true,
    then: () => Yup.string().required('OTP is required'),
    otherwise: () => Yup.string(),
  }),
});

function SignIn() {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!otpSent) {
        // Send OTP logic here
        setOtpSent(true);
      } else {
        // Verify OTP and sign in logic here
        navigate('/welcome');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
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
        <Typography component="h2" variant="h5" gutterBottom>
          Sign In / Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            loginId: '',
            password: '',
            mobile: '',
            captcha: '',
            otp: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="loginId"
                  label="Login ID"
                  name="loginId"
                  autoComplete="username"
                  autoFocus
                  value={values.loginId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.loginId && Boolean(errors.loginId)}
                  helperText={touched.loginId && errors.loginId}
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

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="mobile"
                  label="Mobile Number"
                  type="tel"
                  id="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.mobile && Boolean(errors.mobile)}
                  helperText={touched.mobile && errors.mobile}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="captcha"
                  label="Captcha Code"
                  id="captcha"
                  value={values.captcha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.captcha && Boolean(errors.captcha)}
                  helperText={touched.captcha && errors.captcha}
                />

                {otpSent && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="otp"
                    label="OTP"
                    id="otp"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.otp && Boolean(errors.otp)}
                    helperText={touched.otp && errors.otp}
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  {otpSent ? 'Sign In' : 'Send OTP'}
                </Button>

                {otpSent && (
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => setOtpSent(false)}
                    sx={{ mb: 2 }}
                  >
                    Resend OTP
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}

export default SignIn; 