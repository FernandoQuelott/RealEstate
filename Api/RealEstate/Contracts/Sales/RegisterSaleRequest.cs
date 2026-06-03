namespace RealEstate.Api.Contracts.Sales;

public sealed record RegisterSaleRequest(
    Guid ClienteId,
    Guid ApartamentoId,
    decimal ValorVenda);
