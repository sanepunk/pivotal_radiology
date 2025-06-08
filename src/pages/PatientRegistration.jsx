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
  Alert,
  MenuItem,
} from '@mui/material';
import { patientAPI } from '../services/api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import BackgroundWrapper from '../components/BackgroundWrapper';
import MedicalPaper from '../components/MedicalPaper';

const validationSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  date_of_birth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .required('Gender is required'),
  contact: Yup.object().shape({
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
      .required('Phone number is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required')
  }),
  address: Yup.string().required('Address is required'),
  medical_history: Yup.string(),
});

function PatientRegistration() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');
    try {
      // Format date only if it exists
      const formattedDate = values.date_of_birth ? format(values.date_of_birth, 'yyyy-MM-dd') : '';
      
      const response = await patientAPI.createPatient({
        ...values,
        name: values.name || '',
        gender: values.gender || '',
        date_of_birth: formattedDate,
        contact: {
          phone: values.contact?.phone || '',
          email: values.contact?.email || ''
        },
        address: values.address || '',
        medical_history: values.medical_history || ''
      });
      
      // Navigate to success page with patient data
      navigate('/patient-register-success', { 
        state: { 
          patientData: {
            ...values,
            uid: response.data.uid,
            name: values.name || '',
            gender: values.gender || '',
            date_of_birth: formattedDate,
            contact: {
              phone: values.contact?.phone || '',
              email: values.contact?.email || ''
            },
            address: values.address || '',
            medical_history: values.medical_history || ''
          }
        }
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register patient. Please try again.');
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <BackgroundWrapper>
        <Container component="main" maxWidth="lg">
          <MedicalPaper
            elevation={3}
            sx={{
              maxWidth: 'md',
              mx: 'auto',
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
                name: '',
                date_of_birth: null,
                gender: '',
                contact: {
                  phone: '',
                  email: ''
                },
                address: '',
                medical_history: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
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
                      value={values.name || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date of Birth"
                          value={values.date_of_birth}
                          onChange={(date) => setFieldValue('date_of_birth', date)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              fullWidth
                              margin="normal"
                              error={touched.date_of_birth && Boolean(errors.date_of_birth)}
                              helperText={touched.date_of_birth && errors.date_of_birth}
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
                        value={values.gender || ''}
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
                      id="contact.phone"
                      label="Phone Number"
                      name="contact.phone"
                      value={(values.contact && values.contact.phone) || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contact?.phone && Boolean(errors.contact?.phone)}
                      helperText={touched.contact?.phone && errors.contact?.phone}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="contact.email"
                      label="Email Address"
                      name="contact.email"
                      autoComplete="email"
                      value={(values.contact && values.contact.email) || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contact?.email && Boolean(errors.contact?.email)}
                      helperText={touched.contact?.email && errors.contact?.email}
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
                      value={values.address || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />

                    <TextField
                      margin="normal"
                      fullWidth
                      id="medical_history"
                      label="Medical History"
                      name="medical_history"
                      multiline
                      rows={4}
                      value={values.medical_history || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.medical_history && Boolean(errors.medical_history)}
                      helperText={touched.medical_history && errors.medical_history}
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
          </MedicalPaper>
        </Container>
      </BackgroundWrapper>
    </Layout>
  );
}

export default PatientRegistration; 