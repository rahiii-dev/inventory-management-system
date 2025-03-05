import axios from "axios";
import { toast } from "sonner";
import { clearToken, clearUser, getToken, getUser } from "../utils/storage";

const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Request Interceptor (Optional)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken()
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        } 
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        const originalRequest = error.config

        if (!response) {
            toast.error("Unable to reach the server!", { description: "Please try again later." });
        } else if (response.status >= 500) {
            toast.error("Something went wrong!", { description: "Please try again later." });
        } else if (response.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            try {
                const userId = getUser()?.id
                const token = (await axiosInstance.post<{token: string}>("/user/refresh-token", {userId})).data.token;
                if(localStorage.getItem('token')){
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
                return axiosInstance(originalRequest);
            } catch (error) {
                toast.error("Session expired. Please log in to continue", {
                    duration: 500,
                    onAutoClose: () => {
                        clearUser();
                        clearToken();
                        window.location.href = "/auth/login"; 
                    },
                });
            }
        } else if(response.status === 403){
            toast.error("Forbidden access. Please log in to continue.", {
                duration: 500,
                onAutoClose: () => {
                    clearUser();
                    clearToken();
                    window.location.href = "/auth/login"; 
                },
            });
        }

        // Reject all errors so the application
        return Promise.reject(error);
    }
);

export default axiosInstance;

