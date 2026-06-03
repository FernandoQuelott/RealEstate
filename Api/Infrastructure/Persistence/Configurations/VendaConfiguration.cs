using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class VendaConfiguration : IEntityTypeConfiguration<Venda>
{
    public void Configure(EntityTypeBuilder<Venda> builder)
    {
        builder.ToTable("Vendas");

        builder.ConfigureBaseEntity();

        builder.Property(x => x.ClienteId)
            .IsRequired();

        builder.Property(x => x.ApartamentoId)
            .IsRequired();

        builder.Property(x => x.DataVenda)
            .IsRequired();

        builder.Property(x => x.ValorVenda)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.HasOne(x => x.Cliente)
            .WithMany()
            .HasForeignKey(x => x.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Apartamento)
            .WithOne()
            .HasForeignKey<Venda>(x => x.ApartamentoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.ClienteId);
        builder.HasIndex(x => x.ApartamentoId)
            .IsUnique();
        builder.HasIndex(x => x.DataVenda);
    }
}
