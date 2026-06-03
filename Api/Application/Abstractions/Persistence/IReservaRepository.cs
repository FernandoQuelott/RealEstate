using Domain.Entities;

namespace Application.Abstractions.Persistence;

public interface IReservaRepository : IRepository<Reserva>
{
    Task<Reserva?> GetActiveByApartmentIdAsync(Guid apartmentId, CancellationToken cancellationToken = default);
}