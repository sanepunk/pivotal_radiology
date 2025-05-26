import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import Layout from '../components/Layout';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer'),
  sex: Yup.string().required('Sex is required'),
  mobile: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email address'),
  whatsapp: Yup.string().matches(/^\d{10}$/, 'WhatsApp number must be 10 digits'),
  address: Yup.string().required('Address is required'),
  location: Yup.string().required('Location is required'),
});

function PatientForm() {
  const navigate = useNavigate();
  const [uid, setUid] = useState('');

  const generateUID = () => {
    // Generate a unique ID (you can implement your own logic)
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `TB-${timestamp}-${randomStr}`.toUpperCase();
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const generatedUid = generateUID();
      setUid(generatedUid);
      
      // Save patient data
      const patientData = {
        ...values,
        uid: generatedUid,
        createdAt: new Date().toISOString(),
      };

      // Navigate to image upload
      navigate('/upload', { state: { patientData } });
    } catch (error) {
      console.error('Error saving patient data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            New Patient Registration
          </Typography>

          <Formik
            initialValues={{
              name: '',
              age: '',
              sex: '',
              mobile: '',
              email: '',
              whatsapp: '',
              address: '',
              location: '',
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
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isSubmitting}
                    >
                      Register & Continue
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