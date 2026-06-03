using Domain.Entities;

namespace Application.Abstractions.Services;

public interface IVendaService
{
    Task<Venda> RegisterAsync(Guid customerId, Guid apartmentId, decimal saleAmount, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Venda>> GetAllAsync(CancellationToken cancellationToken = default);
}
