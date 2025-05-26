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
  MenuItem,
} from '@mui/material';
import { patientAPI } from '../services/api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .required('Gender is required'),
  contactNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .required('Contact number is required'),
  address: Yup.string().required('Address is required'),
  medicalHistory: Yup.string(),
});

function PatientRegistration() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');
    try {
      const response = await patientAPI.createPatient(values);
      // After successful registration, navigate to welcome page
      navigate('/welcome', { 
        state: { 
          message: 'Patient registered successfully',
          patientId: response.data.uid 
        }
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register patient. Please try again.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
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
          Register New Patient
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            gender: '',
            contactNumber: '',
            address: '',
            medicalHistory: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoFocus
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={values.dateOfBirth}
                      onChange={(date) => setFieldValue('dateOfBirth', date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          fullWidth
                          margin="normal"
                          error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                          helperText={touched.dateOfBirth && errors.dateOfBirth}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    select
                    id="gender"
                    label="Gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Box>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  placeholder="+1234567890"
                  value={values.contactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.contactNumber && Boolean(errors.contactNumber)}
                  helperText={touched.contactNumber && errors.contactNumber}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="medicalHistory"
                  label="Medical History"
                  name="medicalHistory"
                  multiline
                  rows={4}
                  value={values.medicalHistory}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.medicalHistory && Boolean(errors.medicalHistory)}
                  helperText={touched.medicalHistory && errors.medicalHistory}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Registering Patient...' : 'Register Patient'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}

export default PatientRegistration; 