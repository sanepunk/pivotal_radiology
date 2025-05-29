import axios from 'axios';
import { supabase } from './supabase';

// const API_BASE_URL = 'https://pivotal-radiology-backend.onrender.com'; // FastAPI backend URL
const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // If this is a login response, store the token and user data
    if (response.config.url === '/auth/login') {
      const token = `Bearer ${response.data.access_token}`;
      localStorage.setItem('token', token);
      // After login, fetch user data
      api.get('/auth/verify')
        .then(userResponse => {
          localStorage.setItem('user', JSON.stringify(userResponse.data));
        });
    }
    // If this is a verify response, store user data
    if (response.config.url === '/auth/verify') {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
  getDoctors: () => api.get('/auth/doctors'),
  deleteDoctor: (email) => api.delete(`/auth/doctors/${email}`),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Patient endpoints
export const patientAPI = {
  createPatient: (patientData) => api.post('/patients', patientData),
  getPatients: () => api.get('/patients'),
  getPatientById: (id) => api.get(`/patients/${id}`),
  updatePatient: (id, data) => api.put(`/patients/${id}`, data),
  searchPatients: (query) => api.get('/patients/search', { params: query }),
  getPatientHistory: (patientUid) => api.get(`/patients/${patientUid}/visits`),
  addVisitHistory: (patientUid, visitData) => api.post(`/patients/${patientUid}/visits`, visitData),
  getPatientFiles: (patientUid) => api.get(`/patients/${patientUid}/files`),
};

// File endpoints
export const fileAPI = {
  uploadFile: async (formData, onUploadProgress) => {
    try {
      const file = formData.get('file');
      const patientUid = formData.get('patientUid');
      const doctorName = formData.get('doctor_name');
      const notes = formData.get('notes');

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration is missing. Please check your .env file.');
      }

      console.log('Starting file upload to Supabase...');
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        patientUid,
        doctorName
      });

      // First check if the bucket exists
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();

      if (bucketError) {
        console.error('Error checking buckets:', bucketError);
        throw new Error('Failed to check storage buckets. Please ensure you have proper permissions.');
      }

      const bucketExists = buckets.some(b => b.name === 'pivotal');
      if (!bucketExists) {
        throw new Error('Storage bucket "patient-files" not found. Please create it in your Supabase dashboard.');
      }

      // Upload file to Supabase Storage
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${patientUid}/${timestamp}.${fileExt}`;
      
      console.log('Uploading to Supabase path:', filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pivotal')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            if (onUploadProgress) {
              onUploadProgress({ loaded: progress.loaded, total: progress.total });
            }
          }
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully to Supabase:', uploadData);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('pivtoal')
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL from Supabase');
      }

      console.log('Got public URL:', urlData.publicUrl);

      // Save file reference to backend
      const fileData = new FormData();
      fileData.append('patientUid', patientUid);
      fileData.append('doctor_name', doctorName);
      if (notes) fileData.append('notes', notes);
      fileData.append('file_path', urlData.publicUrl);
      fileData.append('file_name', file.name);
      fileData.append('file_type', file.type);

      console.log('Saving file reference to backend...');
      const response = await api.post('/patients/files/upload', fileData);
      console.log('File reference saved successfully:', response.data);
      
      return response;
    } catch (error) {
      console.error('Upload error:', error);
      // Add more context to the error
      if (error.message.includes('bucket')) {
        throw new Error('Storage setup required: ' + error.message + ' Please contact your administrator.');
      }
      throw new Error(`File upload failed: ${error.message}`);
    }
  },
  
  getFile: async (fileId) => {
    const response = await api.get(`/patients/files/${fileId}`);
    return response;
  }
};

// Image analysis endpoints
export const analysisAPI = {
  uploadImage: (patientId, formData) => 
    api.post(`/analysis/${patientId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getAnalysisResult: (analysisId) => api.get(`/analysis/${analysisId}`)
};

export default api; 