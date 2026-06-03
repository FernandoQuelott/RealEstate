using Application.Abstractions.Persistence;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class ReservaRepository : Repository<Reserva>, IReservaRepository
{
    public ReservaRepository(AppDbContext context) : base(context)
    {
    }

    public override Task<Reserva?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => DbSet
            .Include(r => r.Cliente)
            .Include(r => r.Apartamento)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

    public Task<Reserva?> GetActiveByApartmentIdAsync(Guid apartmentId, CancellationToken cancellationToken = default)
        => DbSet.FirstOrDefaultAsync(r => r.ApartamentoId == apartmentId && r.Status == ReservaStatus.Active, cancellationToken);

    public override async Task<IReadOnlyList<Reserva>> ListAsync(CancellationToken cancellationToken = default)
        => await DbSet
            .AsNoTracking()
            .Include(r => r.Cliente)
            .Include(r => r.Apartamento)
            .OrderByDescending(r => r.DataReserva)
            .ToListAsync(cancellationToken);
}