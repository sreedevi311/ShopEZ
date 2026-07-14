import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // Points directly to your Express server port
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor to automatically attach JWT token to headers if available
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;