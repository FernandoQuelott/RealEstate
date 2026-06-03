using Application.Abstractions.Persistence;
using Application.Abstractions.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Application.Services;

public sealed class ApartamentoService : IApartamentoService
{
    private readonly IApartamentoRepository _apartamentoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ApartamentoService(IApartamentoRepository apartamentoRepository, IUnitOfWork unitOfWork)
    {
        _apartamentoRepository = apartamentoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Apartamento> CreateAsync(string number, string block, int floor, decimal price, CancellationToken cancellationToken = default)
    {
        var existingApartment = await _apartamentoRepository.GetByNumberAndBlockAsync(number, block, cancellationToken);
        if (existingApartment is not null)
        {
            throw new BusinessException("An apartment with the same number and block already exists.");
        }

        var apartment = new Apartamento(number, block, floor, price);
        await _apartamentoRepository.AddAsync(apartment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return apartment;
    }

    public Task<IReadOnlyList<Apartamento>> GetAllAsync(CancellationToken cancellationToken = default)
        => _apartamentoRepository.ListAsync(cancellationToken);

    public async Task<Apartamento> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _apartamentoRepository.GetByIdAsync(id, cancellationToken)
           ?? throw new NotFoundException("Apartment not found.");

    public async Task<Apartamento> UpdateAsync(Guid id, string number, string block, int floor, decimal price, CancellationToken cancellationToken = default)
    {
        var apartment = await _apartamentoRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Apartment not found.");

        var existingApartment = await _apartamentoRepository.GetByNumberAndBlockAsync(number, block, cancellationToken);
        if (existingApartment is not null && existingApartment.Id != id)
        {
            throw new BusinessException("An apartment with the same number and block already exists.");
        }

        apartment.Update(number, block, floor, price);
        _apartamentoRepository.Update(apartment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return apartment;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var apartment = await _apartamentoRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Apartment not found.");

        _apartamentoRepository.Remove(apartment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
