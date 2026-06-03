using Application.Abstractions.Persistence;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class ApartamentoRepository : Repository<Apartamento>, IApartamentoRepository
{
    public ApartamentoRepository(AppDbContext context) : base(context)
    {
    }

    public Task<Apartamento?> GetByNumberAndBlockAsync(string number, string block, CancellationToken cancellationToken = default)
        => DbSet.FirstOrDefaultAsync(a => a.Numero == number && a.Bloco == block, cancellationToken);

    public override async Task<IReadOnlyList<Apartamento>> ListAsync(CancellationToken cancellationToken = default)
        => await DbSet
            .AsNoTracking()
            .OrderBy(a => a.Bloco)
            .ThenBy(a => a.Numero)
            .ToListAsync(cancellationToken);
}