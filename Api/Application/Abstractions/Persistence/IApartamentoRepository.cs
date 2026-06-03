using Domain.Entities;

namespace Application.Abstractions.Persistence;

public interface IApartamentoRepository : IRepository<Apartamento>
{
    Task<Apartamento?> GetByNumberAndBlockAsync(string number, string block, CancellationToken cancellationToken = default);
}