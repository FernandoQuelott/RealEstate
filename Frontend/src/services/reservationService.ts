import { httpClient } from "@/services/httpClient";
import type { CreateReservationRequest, Reservation } from "@/types/entities";

export const reservationService = {
    async list(): Promise<Reservation[]> {
        const response = await httpClient.get<Reservation[]>("/api/reservas");
        return response.data;
    },

    async create(payload: CreateReservationRequest): Promise<Reservation> {
        const response = await httpClient.post<Reservation>("/api/reservas", payload);
        return response.data;
    },

    async cancel(id: string): Promise<void> {
        await httpClient.patch(`/api/reservas/${id}/cancel`);
    }
};
