using Application.Abstractions.Services;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Api.Contracts.Reservations;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/reservas")]
[Authorize]
public sealed class ReservasController : ControllerBase
{
    private readonly IReservaService _reservationService;

    public ReservasController(IReservaService reservationService)
    {
        _reservationService = reservationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var reserva = await _reservationService.CreateAsync(request.ClienteId, request.ApartamentoId, cancellationToken);
            return Ok(reserva);
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
        var reservas = await _reservationService.GetAllAsync(cancellationToken);
        return Ok(reservas);
    }

    [HttpPatch("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await _reservationService.CancelAsync(id, cancellationToken);
            return NoContent();
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
}