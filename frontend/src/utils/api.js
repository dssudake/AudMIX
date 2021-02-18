// Creating a new instance of axios for custom API config.
import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8000/api/',
  responseType: 'json',
});
