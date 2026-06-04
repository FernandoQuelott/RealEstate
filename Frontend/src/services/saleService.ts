import { httpClient } from "@/services/httpClient";
import type { RegisterSaleRequest, Sale } from "@/types/entities";

export const saleService = {
    async list(): Promise<Sale[]> {
        const response = await httpClient.get<Sale[]>("/api/vendas");
        return response.data;
    },

    async create(payload: RegisterSaleRequest): Promise<Sale> {
        const response = await httpClient.post<Sale>("/api/vendas", payload);
        return response.data;
    }
};
