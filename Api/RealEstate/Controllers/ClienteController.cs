using Application.Abstractions.Services;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Api.Contracts.Customers;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/cliente")]
[Authorize]
public sealed class ClienteController : ControllerBase
{
    private readonly IClienteService _customerService;

    public ClienteController(IClienteService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var cliente = await _customerService.CreateAsync(request.Nome, request.Cpf, request.Email, request.Telefone, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var cliente = await _customerService.GetAllAsync(cancellationToken);
        return Ok(cliente);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var cliente = await _customerService.GetByIdAsync(id, cancellationToken);
            return Ok(cliente);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var cliente = await _customerService.UpdateAsync(id, request.Nome, request.Email, request.Telefone, cancellationToken);
            return Ok(cliente);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await _customerService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}