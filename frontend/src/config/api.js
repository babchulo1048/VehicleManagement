import axios from 'axios';


const API_BASE_URL = "http://localhost:3001";
// const API_BASE_URL = "http://188.245.35.116:3001";


// Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export { axiosInstance };
