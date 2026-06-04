import { httpClient } from "@/services/httpClient";
import type { LoginRequest, LoginResponse } from "@/types/entities";

type LoginApiResponse =
    | string
    | {
        token?: string;
        Token?: string;
        accessToken?: string;
        AccessToken?: string;
        jwt?: string;
        data?: {
            token?: string;
            Token?: string;
            accessToken?: string;
            AccessToken?: string;
        };
    };

const extractToken = (response: LoginApiResponse): string | null => {
    if (typeof response === "string" && response.trim()) {
        return response;
    }

    if (!response || typeof response !== "object") {
        return null;
    }

    return response.token
        ?? response.Token
        ?? response.accessToken
        ?? response.AccessToken
        ?? response.jwt
        ?? response.data?.token
        ?? response.data?.Token
        ?? response.data?.accessToken
        ?? response.data?.AccessToken
        ?? null;
};

export const authService = {
    async login(payload: LoginRequest): Promise<LoginResponse> {
        const response = await httpClient.post<LoginApiResponse>("/api/auth/login", payload);
        const token = extractToken(response.data);

        if (!token) {
            throw new Error("Resposta de login invalida: token nao encontrado.");
        }

        return { token };
    }
};
