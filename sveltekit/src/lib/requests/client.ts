import { m } from "$lib/paraglide/messages";
import axios, { type AxiosInstance } from "axios";
import toast from "svelte-french-toast";

const apiClient: AxiosInstance = axios.create({
    baseURL: "https://api.example.com",
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === "ERR_NETWORK" || !navigator.onLine) {
            toast.error(m["errors.offline-description"]());
        }

        return Promise.reject(error);
    },
);

export default apiClient;
