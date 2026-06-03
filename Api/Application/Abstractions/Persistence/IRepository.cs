using Domain.Common;

namespace Application.Abstractions.Persistence;

public interface IRepository<T> where T : Entity
{
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> ListAsync(CancellationToken cancellationToken = default);
    void Update(T entity);
    void Remove(T entity);
}