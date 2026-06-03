using Domain.Entities;

namespace Application.Abstractions.Services;

public interface IReservaService
{
    Task<Reserva> CreateAsync(Guid customerId, Guid apartmentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Reserva>> GetAllAsync(CancellationToken cancellationToken = default);
    Task CancelAsync(Guid reservationId, CancellationToken cancellationToken = default);
}
