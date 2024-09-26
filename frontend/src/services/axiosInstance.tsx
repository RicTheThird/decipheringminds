import axios from 'axios';
import { useLocation } from 'react-router-dom';

// Create an Axios instance
const axiosInstance = axios.create({
    //baseURL: "https://decipheringmindsbackend.azurewebsites.net/api"// -- for prod
    baseURL: "/api",
});


// Add a request interceptor to include the Bearer token
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');

        // If token exists, add it to the request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 && error.response.data !== 'LoginFailed') {
        localStorage.setItem('sessiontimeout', 'true');
        localStorage.removeItem('authToken')
        window.location.href = '/login'; // Redirect to login page
    }
    return error;
});


export default axiosInstance;
