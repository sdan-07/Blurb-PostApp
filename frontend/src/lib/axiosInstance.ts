import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://blurb-postapp.onrender.com/api',
  withCredentials: true,
});

export default axiosInstance;
