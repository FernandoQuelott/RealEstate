using Application.Abstractions.Services;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Api.Contracts.Sales;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/vendas")]
[Authorize]
public sealed class VendasController : ControllerBase
{
    private readonly IVendaService _saleService;

    public VendasController(IVendaService saleService)
    {
        _saleService = saleService;
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RegisterSaleRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var sale = await _saleService.RegisterAsync(request.ClienteId, request.ApartamentoId, request.ValorVenda, cancellationToken);
            return Ok(sale);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var sales = await _saleService.GetAllAsync(cancellationToken);
        return Ok(sales);
    }
}