import { EntityService } from "@/services/entityService";
import { httpClient } from "@/services/httpClient";
import type {
    Apartment,
    CreateApartmentRequest,
    UpdateApartmentRequest
} from "@/types/entities";

export const apartmentService = new EntityService<
    Apartment,
    CreateApartmentRequest,
    UpdateApartmentRequest
>("/api/apartamentos", httpClient);
