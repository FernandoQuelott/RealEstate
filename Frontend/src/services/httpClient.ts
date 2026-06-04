import axios from "axios";
import { tokenStorage } from "@/utils/storage";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});

httpClient.interceptors.request.use((config) => {
    const token = tokenStorage.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const statusCode = error.response?.status as number | undefined;
        const shouldRetry = [408, 429, 502, 503, 504].includes(statusCode ?? 0);

        const retries = Number(error.config?._retries ?? 0);
        if (shouldRetry && retries < 2) {
            error.config._retries = retries + 1;
            await new Promise((resolve) => setTimeout(resolve, 350 * (retries + 1)));
            return httpClient(error.config);
        }

        return Promise.reject(error);
    }
);
