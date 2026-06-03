using Application.Abstractions.Persistence;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class Repository<T> : IRepository<T> where T : Entity
{
    protected readonly AppDbContext Context;
    protected readonly DbSet<T> DbSet;

    public Repository(AppDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    public virtual Task AddAsync(T entity, CancellationToken cancellationToken = default)
        => DbSet.AddAsync(entity, cancellationToken).AsTask();

    public virtual Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => DbSet.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public virtual async Task<IReadOnlyList<T>> ListAsync(CancellationToken cancellationToken = default)
        => await DbSet
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public virtual void Update(T entity)
        => DbSet.Update(entity);

    public virtual void Remove(T entity)
        => DbSet.Remove(entity);
}
