import axios from 'axios';

// Logic: Frontend chạy trên trình duyệt, gọi thẳng vào port 3000 của máy chủ
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const backendURL = `${protocol}//${hostname}:3000/api`;

const axiosClient = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;