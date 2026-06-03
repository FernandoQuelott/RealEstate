namespace RealEstate.Api.Contracts.Customers;

public sealed record CreateCustomerRequest(
    string Nome,
    string Cpf,
    string Email,
    string Telefone);
