import axios, { type AxiosInstance } from "axios";

import { addToast } from "$lib/components/Toaster.svelte";
import { m } from "$lib/paraglide/messages";

const AxiosClient: AxiosInstance = axios.create({
    baseURL: "https://api.example.com",
    timeout: 10000,
});

AxiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

AxiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === "ERR_NETWORK" || !navigator.onLine) {
            addToast({
                data: {
                    description: m["errors.offline-description"](),
                    variant: "error",
                },
            });
        }

        return Promise.reject(error);
    },
);

export default AxiosClient;
