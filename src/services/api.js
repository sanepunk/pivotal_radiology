import axios from 'axios';

const API_BASE_URL = 'https://pivotal-radiology-backend.onrender.com'; // FastAPI backend URL

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
  uploadFile: (formData, onUploadProgress) => 
    api.post('/patients/files/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress
    }),
  getFile: (fileId) => api.get(`/patients/files/${fileId}`),
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