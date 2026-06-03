namespace RealEstate.Api.Services;

public interface ITokenService
{
    string GenerateToken(string username);
}