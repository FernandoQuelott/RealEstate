using Domain.Entities;

namespace Application.Abstractions.Persistence;

public interface IClienteRepository : IRepository<Cliente>
{
    Task<Cliente?> GetByCpfAsync(string cpf, CancellationToken cancellationToken = default);
}