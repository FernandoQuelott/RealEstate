using Domain.Entities;

namespace Application.Abstractions.Services;

public interface IClienteService
{
    Task<Cliente> CreateAsync(string name, string cpf, string email, string phone, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Cliente>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Cliente> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Cliente> UpdateAsync(Guid id, string name, string email, string phone, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}