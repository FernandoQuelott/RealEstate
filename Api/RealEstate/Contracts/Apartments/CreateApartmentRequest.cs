namespace RealEstate.Api.Contracts.Apartments;

public sealed record CreateApartmentRequest(
    string Numero,
    string Bloco,
    int Andar,
    decimal Valor);
