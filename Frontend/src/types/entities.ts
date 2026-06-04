export type UUID = string;

export enum ApartmentStatus {
    Available = 1,
    Reserved = 2,
    Sold = 3
}

export enum ReservationStatus {
    Active = 1,
    Canceled = 2,
    Closed = 3
}

export interface AuditableEntity {    
    id: UUID;
    dataCriacao: string;
    dataAtualizacao: string;
    usuarioCriacao: string;
    usuarioAtualizacao: string;
}

export interface Apartment extends AuditableEntity {
    numero: string;
    bloco: string;
    andar: number;
    valor: number;
    status: ApartmentStatus;
}

export interface Customer extends AuditableEntity {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataCadastro: string;
}

export interface Reservation extends AuditableEntity {
    clienteId: UUID;
    apartamentoId: UUID;
    dataReserva: string;
    status: ReservationStatus;
    cliente?: Customer;
    apartamento?: Apartment;
}

export interface Sale extends AuditableEntity {
    clienteId: UUID;
    apartamentoId: UUID;
    dataVenda: string;
    valorVenda: number;
    cliente?: Customer;
    apartamento?: Apartment;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface CreateApartmentRequest {
    numero: string;
    bloco: string;
    andar: number;
    valor: number;
}

export interface UpdateApartmentRequest {
    numero: string;
    bloco: string;
    andar: number;
    valor: number;
}

export interface CreateCustomerRequest {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
}

export interface UpdateCustomerRequest {
    nome: string;
    email: string;
    telefone: string;
}

export interface CreateReservationRequest {
    clienteId: UUID;
    apartamentoId: UUID;
}

export interface RegisterSaleRequest {
    clienteId: UUID;
    apartamentoId: UUID;
    valorVenda: number;
}

export interface ApiError {
    message: string;
}
