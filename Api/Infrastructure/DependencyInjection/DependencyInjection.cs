using Application.Abstractions.Persistence;
using Application.Abstractions.Services;
using Application.Services;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddScoped<IClienteRepository, ClienteRepository>();
        services.AddScoped<IApartamentoRepository, ApartamentoRepository>();
        services.AddScoped<IReservaRepository, ReservaRepository>();
        services.AddScoped<IVendaRepository, VendaRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IApartamentoService, ApartamentoService>();
        services.AddScoped<IReservaService, ReservaService>();
        services.AddScoped<IVendaService, VendaService>();

        return services;
    }
}