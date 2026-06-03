using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class ReservaConfiguration : IEntityTypeConfiguration<Reserva>
{
    public void Configure(EntityTypeBuilder<Reserva> builder)
    {
        builder.ToTable("Reservas");

        builder.ConfigureBaseEntity();

        builder.Property(x => x.ClienteId)
            .IsRequired();

        builder.Property(x => x.ApartamentoId)
            .IsRequired();

        builder.Property(x => x.DataReserva)
            .IsRequired();

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(ReservaStatus.Active);

        builder.HasOne(x => x.Cliente)
            .WithMany()
            .HasForeignKey(x => x.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Apartamento)
            .WithMany()
            .HasForeignKey(x => x.ApartamentoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.ClienteId);
        builder.HasIndex(x => x.ApartamentoId);
        builder.HasIndex(x => new { x.ApartamentoId, x.Status });
    }
}
