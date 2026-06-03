using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RealEstate.Api.Contracts.Auth;
using RealEstate.Api.Options;
using RealEstate.Api.Services;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly JwtOptions _jwtOptions;
    private readonly ITokenService _tokenService;

    public AuthController(IOptions<JwtOptions> jwtOptions, ITokenService tokenService)
    {
        _jwtOptions = jwtOptions.Value;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request.Username != _jwtOptions.Username || request.Password != _jwtOptions.Password)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var token = _tokenService.GenerateToken(request.Username);
        return Ok(new LoginResponse(token));
    }
}
