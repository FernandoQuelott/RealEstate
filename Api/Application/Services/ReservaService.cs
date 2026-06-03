using Application.Abstractions.Persistence;
using Application.Abstractions.Services;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;

namespace Application.Services;

public sealed class ReservaService : IReservaService
{
    private readonly IClienteRepository _clienteRepository;
    private readonly IApartamentoRepository _apartamentoRepository;
    private readonly IReservaRepository _reservaRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReservaService(IClienteRepository clienteRepository,
                          IApartamentoRepository apartamentoRepository,
                          IReservaRepository reservaRepository,
                          IUnitOfWork unitOfWork)
    {
        _clienteRepository = clienteRepository;
        _apartamentoRepository = apartamentoRepository;
        _reservaRepository = reservaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Reserva> CreateAsync(Guid customerId, Guid apartmentId, CancellationToken cancellationToken = default)
    {
        var customer = await _clienteRepository.GetByIdAsync(customerId, cancellationToken);
        if (customer is null)
        {
            throw new NotFoundException("Customer not found.");
        }

        var apartment = await _apartamentoRepository.GetByIdAsync(apartmentId, cancellationToken);
        if (apartment is null)
        {
            throw new NotFoundException("Apartment not found.");
        }

        if (apartment.Status != ApartamentoStatus.Available)
        {
            throw new BusinessException("An apartment can only be reserved when it is available.");
        }

        apartment.Reserve();

        var reservation = new Reserva(customerId, apartmentId);
        await _reservaRepository.AddAsync(reservation, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return reservation;
    }

    public Task<IReadOnlyList<Reserva>> GetAllAsync(CancellationToken cancellationToken = default)
        => _reservaRepository.ListAsync(cancellationToken);

    public async Task CancelAsync(Guid reservationId, CancellationToken cancellationToken = default)
    {
        var reservation = await _reservaRepository.GetByIdAsync(reservationId, cancellationToken);
        if (reservation is null)
        {
            throw new NotFoundException("Reservation not found.");
        }

        reservation.Cancel();
        reservation.Apartamento.ReleaseReservation();

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
