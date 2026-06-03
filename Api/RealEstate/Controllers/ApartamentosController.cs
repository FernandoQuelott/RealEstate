using Application.Abstractions.Services;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Api.Contracts.Apartments;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/apartamentos")]
[Authorize]
public sealed class ApartamentosController : ControllerBase
{
    private readonly IApartamentoService _apartmentService;

    public ApartamentosController(IApartamentoService apartmentService)
    {
        _apartmentService = apartmentService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateApartmentRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var apartmento = await _apartmentService.CreateAsync(request.Numero, request.Bloco, request.Andar, request.Valor, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = apartmento.Id }, apartmento);
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var apartmentos = await _apartmentService.GetAllAsync(cancellationToken);
        return Ok(apartmentos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var apartmento = await _apartmentService.GetByIdAsync(id, cancellationToken);
            return Ok(apartmento);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateApartmentRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var apartmento = await _apartmentService.UpdateAsync(id, request.Numero, request.Bloco, request.Andar, request.Valor, cancellationToken);
            return Ok(apartmento);
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

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await _apartmentService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}