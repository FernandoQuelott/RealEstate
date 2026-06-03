using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> builder)
    {
        builder.ToTable("Clientes");

        builder.ConfigureBaseEntity();

        builder.Property(x => x.Nome)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Cpf)
            .IsRequired()
            .HasMaxLength(11);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Telefone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.DataCadastro)
            .IsRequired();

        builder.HasIndex(x => x.Cpf)
            .IsUnique();

        builder.HasIndex(x => x.Email)
            .IsUnique();
    }
}
