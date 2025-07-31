import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Alert,
} from '@mui/material';
import Layout from '../components/Layout';
import { patientAPI } from '../services/api';
import LoadingTips from '../components/LoadingTips';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer'),
  sex: Yup.string().required('Sex is required'),
  mobile: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  email: Yup.string().email('Invalid email address'),
  whatsapp: Yup.string().matches(/^\d{10}$/, 'WhatsApp number must be 10 digits'),
  address: Yup.string().required('Address is required'),
  location: Yup.string().required('Location is required'),
});

function PatientForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const existingPatient = location.state?.patientData;

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 200);

      const patientData = {
        ...values,
        createdAt: new Date().toISOString(),
      };

      // Create or update patient
      const response = existingPatient
        ? await patientAPI.updatePatient(existingPatient.id, patientData)
        : await patientAPI.createPatient(patientData);

      clearInterval(progressInterval);
      setProgress(100);

      // Navigate to image upload with patient data
      navigate('/upload', { 
        state: { 
          patientData: response.data,
          isNewPatient: !existingPatient
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving patient data');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            {existingPatient ? 'Update Patient' : 'New Patient Registration'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading && <LoadingTips progress={progress} />}

          <Formik
            initialValues={{
              name: existingPatient?.name || '',
              age: existingPatient?.age || '',
              sex: existingPatient?.sex || '',
              mobile: existingPatient?.mobile || '',
              email: existingPatient?.email || '',
              whatsapp: existingPatient?.whatsapp || '',
              address: existingPatient?.address || '',
              location: existingPatient?.location || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={values.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.age && Boolean(errors.age)}
                      helperText={touched.age && errors.age}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      select
                      label="Sex"
                      name="sex"
                      value={values.sex}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.sex && Boolean(errors.sex)}
                      helperText={touched.sex && errors.sex}
                      disabled={loading}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      name="mobile"
                      value={values.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.mobile && Boolean(errors.mobile)}
                      helperText={touched.mobile && errors.mobile}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="WhatsApp Number"
                      name="whatsapp"
                      value={values.whatsapp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.whatsapp && Boolean(errors.whatsapp)}
                      helperText={touched.whatsapp && errors.whatsapp}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      multiline
                      rows={3}
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.location && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isSubmitting || loading}
                    >
                      {existingPatient ? 'Update & Continue' : 'Register & Continue'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Layout>
  );
}

export default PatientForm; 