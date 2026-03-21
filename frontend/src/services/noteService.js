import axios from 'axios';

console.log("ENV URL:", process.env.REACT_APP_API_URL);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Add debugging for API calls
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  }
);

export const noteService = {
  async getAllNotes() {
    const response = await api.get('/api/notes');
    return response.data;
  },

  async createNote(noteData) {
    const response = await api.post('/api/notes', noteData);
    return response.data;
  },

  async updateNote(id, noteData) {
    const response = await api.put(`/api/notes/${id}`, noteData);
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/api/notes/${id}`);
    return response.data;
  },
};
