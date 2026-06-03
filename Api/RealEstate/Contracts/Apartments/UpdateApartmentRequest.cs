namespace RealEstate.Api.Contracts.Apartments;

public sealed record UpdateApartmentRequest(
    string Numero,
    string Bloco,
    int Andar,
    decimal Valor);
