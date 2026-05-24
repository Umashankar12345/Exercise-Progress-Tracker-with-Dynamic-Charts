import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.21.133.28:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export default api;
