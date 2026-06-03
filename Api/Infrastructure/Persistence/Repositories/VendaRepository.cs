using Application.Abstractions.Persistence;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class VendaRepository : Repository<Venda>, IVendaRepository
{
    public VendaRepository(AppDbContext context) : base(context)
    {
    }

    public override Task<Venda?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => DbSet
            .Include(v => v.Cliente)
            .Include(v => v.Apartamento)
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);

    public override async Task<IReadOnlyList<Venda>> ListAsync(CancellationToken cancellationToken = default)
        => await DbSet
            .AsNoTracking()
            .Include(v => v.Cliente)
            .Include(v => v.Apartamento)
            .OrderByDescending(v => v.DataVenda)
            .ToListAsync(cancellationToken);
}