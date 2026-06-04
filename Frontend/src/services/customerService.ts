import { EntityService } from "@/services/entityService";
import { httpClient } from "@/services/httpClient";
import type {
    CreateCustomerRequest,
    Customer,
    UpdateCustomerRequest
} from "@/types/entities";

export const customerService = new EntityService<
    Customer,
    CreateCustomerRequest,
    UpdateCustomerRequest
>("/api/clientes", httpClient);
