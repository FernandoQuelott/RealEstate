namespace RealEstate.Api.Contracts.Customers;

public sealed record UpdateCustomerRequest(
    string Nome,
    string Email,
    string Telefone);
