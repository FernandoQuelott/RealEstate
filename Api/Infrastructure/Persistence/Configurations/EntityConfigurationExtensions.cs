using Domain.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal static class EntityConfigurationExtensions
{
    public static void ConfigureBaseEntity<TEntity>(this EntityTypeBuilder<TEntity> builder)
        where TEntity : Entity
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();

        builder.Property(x => x.DataCriacao).IsRequired();
        builder.Property(x => x.DataAtualizacao).IsRequired();
        builder.Property(x => x.UsuarioCriacao).IsRequired().HasMaxLength(100);
        builder.Property(x => x.UsuarioAtualizacao).IsRequired().HasMaxLength(100);
    }
}
