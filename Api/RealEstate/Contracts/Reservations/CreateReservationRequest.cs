namespace RealEstate.Api.Contracts.Reservations;

public sealed record CreateReservationRequest(
    Guid ClienteId,
    Guid ApartamentoId);
