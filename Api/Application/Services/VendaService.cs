using Application.Abstractions.Persistence;
using Application.Abstractions.Services;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;

namespace Application.Services;

public sealed class VendaService : IVendaService
{
    private readonly IClienteRepository _clienteRepository;
    private readonly IApartamentoRepository _apartamentoRepository;
    private readonly IReservaRepository _reservaRepository;
    private readonly IVendaRepository _vendaRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VendaService(IClienteRepository clienteRepository,
                        IApartamentoRepository apartamentoRepository,
                        IReservaRepository reservaRepository,
                        IVendaRepository vendaRepository,
                        IUnitOfWork unitOfWork)
    {
        _clienteRepository = clienteRepository;
        _apartamentoRepository = apartamentoRepository;
        _reservaRepository = reservaRepository;
        _vendaRepository = vendaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Venda> RegisterAsync(Guid customerId, Guid apartmentId, decimal saleAmount, CancellationToken cancellationToken = default)
    {
        var cleinte = await _clienteRepository.GetByIdAsync(customerId, cancellationToken);
        if (cleinte is null)
        {
            throw new NotFoundException("Customer not found.");
        }

        var apartamento = await _apartamentoRepository.GetByIdAsync(apartmentId, cancellationToken);
        if (apartamento is null)
        {
            throw new NotFoundException("Apartment not found.");
        }

        if (apartamento.Status != ApartamentoStatus.Reserved)
        {
            throw new BusinessException("A sale can only be completed for a reserved apartment.");
        }

        var reserva = await _reservaRepository.GetActiveByApartmentIdAsync(apartmentId, cancellationToken);
        if (reserva is null)
        {
            throw new BusinessException("There is no active reservation for the informed apartment.");
        }

        var venda = new Venda(customerId, apartmentId, saleAmount);
        await _vendaRepository.AddAsync(venda, cancellationToken);

        apartamento.Sell();
        reserva.Close();

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return venda;
    }

    public Task<IReadOnlyList<Venda>> GetAllAsync(CancellationToken cancellationToken = default) => _vendaRepository.ListAsync(cancellationToken);
}
