using Application.Abstractions.Persistence;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class ClienteRepository : Repository<Cliente>, IClienteRepository
{
    public ClienteRepository(AppDbContext context) : base(context)
    {
    }

    public Task<Cliente?> GetByCpfAsync(string cpf, CancellationToken cancellationToken = default) => DbSet.FirstOrDefaultAsync(c => c.Cpf == cpf, cancellationToken);

    public override async Task<IReadOnlyList<Cliente>> ListAsync(CancellationToken cancellationToken = default)
        => await DbSet
            .AsNoTracking()
            .OrderBy(c => c.Nome)
            .ToListAsync(cancellationToken);
}