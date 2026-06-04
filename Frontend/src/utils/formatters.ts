import { ApartmentStatus, ReservationStatus } from "@/types/entities";

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

export const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
});

export const phoneMask = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
};

export const cpfMask = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const parseApiDate = (value: string): string => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return dateTimeFormatter.format(date);
};

export const apartmentStatusLabel = (status: ApartmentStatus): string => {
    switch (status) {
        case ApartmentStatus.Available:
            return "Disponivel";
        case ApartmentStatus.Reserved:
            return "Reservado";
        case ApartmentStatus.Sold:
            return "Vendido";
        default:
            return "Nao informado";
    }
};

export const reservationStatusLabel = (status: ReservationStatus): string => {
    switch (status) {
        case ReservationStatus.Active:
            return "Ativa";
        case ReservationStatus.Canceled:
            return "Cancelada";
        case ReservationStatus.Closed:
            return "Encerrada";
        default:
            return "Nao informado";
    }
};
