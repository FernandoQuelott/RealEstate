using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class ApartamentoConfiguration : IEntityTypeConfiguration<Apartamento>
{
    public void Configure(EntityTypeBuilder<Apartamento> builder)
    {
        builder.ToTable("Apartamentos");

        builder.ConfigureBaseEntity();

        builder.Property(x => x.Numero)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(x => x.Bloco)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.Andar)
            .IsRequired();

        builder.Property(x => x.Valor)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(ApartamentoStatus.Available);

        builder.HasIndex(x => new { x.Bloco, x.Numero })
            .IsUnique();

        builder.HasIndex(x => x.Status);
    }
}
