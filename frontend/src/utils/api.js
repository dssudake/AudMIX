// Creating a new instance of axios for custom API config.
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  responseType: 'json',
});

api.defaults.headers.common['Content-Type'] = 'application/json';

export default api;
