using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Infrastructure.Persistence;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Domain.Entities.Cliente> Clientes => Set<Domain.Entities.Cliente>();
    public DbSet<Domain.Entities.Apartamento> Apartamentos => Set<Domain.Entities.Apartamento>();
    public DbSet<Domain.Entities.Reserva> Reservas => Set<Domain.Entities.Reserva>();
    public DbSet<Domain.Entities.Venda> Vendas => Set<Domain.Entities.Venda>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        DateTime utcNow = DateTime.UtcNow;
        const string defaultUser = "system";

        foreach (var entry in ChangeTracker.Entries().Where(e => e.State is EntityState.Added or EntityState.Modified))
        {
            var entityType = entry.Metadata;

            if (entry.State == EntityState.Added)
            {
                if (HasProperty(entityType, "DataCriacao"))
                {
                    entry.Property("DataCriacao").CurrentValue ??= utcNow;
                }

                if (HasProperty(entityType, "UsuarioCriacao") && string.IsNullOrWhiteSpace(entry.Property("UsuarioCriacao").CurrentValue as string))
                {
                    entry.Property("UsuarioCriacao").CurrentValue = defaultUser;
                }

                if (HasProperty(entityType, "DataAtualizacao"))
                {
                    entry.Property("DataAtualizacao").CurrentValue = utcNow;
                }

                if (HasProperty(entityType, "UsuarioAtualizacao") && string.IsNullOrWhiteSpace(entry.Property("UsuarioAtualizacao").CurrentValue as string))
                {
                    entry.Property("UsuarioAtualizacao").CurrentValue = defaultUser;
                }
            }

            if (entry.State == EntityState.Modified)
            {
                if (HasProperty(entityType, "DataCriacao"))
                {
                    entry.Property("DataCriacao").IsModified = false;
                }

                if (HasProperty(entityType, "UsuarioCriacao"))
                {
                    entry.Property("UsuarioCriacao").IsModified = false;
                }

                if (HasProperty(entityType, "DataAtualizacao"))
                {
                    entry.Property("DataAtualizacao").CurrentValue = utcNow;
                }

                if (HasProperty(entityType, "UsuarioAtualizacao"))
                {
                    entry.Property("UsuarioAtualizacao").CurrentValue = defaultUser;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    private static bool HasProperty(IReadOnlyEntityType entityType, string propertyName)
        => entityType.FindProperty(propertyName) is not null;
}
