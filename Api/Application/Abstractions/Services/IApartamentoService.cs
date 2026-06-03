using Domain.Entities;

namespace Application.Abstractions.Services;

public interface IApartamentoService
{
    Task<Apartamento> CreateAsync(string number, string block, int floor, decimal price, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Apartamento>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Apartamento> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Apartamento> UpdateAsync(Guid id, string number, string block, int floor, decimal price, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}