using System.Net.Mail;
using System.Text.RegularExpressions;
using Application.Abstractions.Persistence;
using Application.Abstractions.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Application.Services;

public sealed class ClienteService : IClienteService
{
    private static readonly Regex RepeatedDigitsRegex = new(@"^(\d)\1{10}$", RegexOptions.Compiled);
    private static readonly Regex PhoneRegex = new(@"^\d{10,11}$", RegexOptions.Compiled);

    private readonly IClienteRepository _clienteRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ClienteService(IClienteRepository clienteRepository, IUnitOfWork unitOfWork)
    {
        _clienteRepository = clienteRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Cliente> CreateAsync(string nome, string cpf, string email, string telefone, CancellationToken cancellationToken = default)
    {
        ValidateCreateInput(cpf, email, telefone);

        var normalizedCpf = OnlyDigits(cpf);

        var existingCliente = await _clienteRepository.GetByCpfAsync(normalizedCpf, cancellationToken);
        if (existingCliente is not null)
        {
            throw new BusinessException("A customer with this CPF already exists.");
        }

        var cliente = new Cliente(nome, normalizedCpf, email.Trim(), NormalizePhone(telefone));
        await _clienteRepository.AddAsync(cliente, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return cliente;
    }

    public Task<IReadOnlyList<Cliente>> GetAllAsync(CancellationToken cancellationToken = default)
        => _clienteRepository.ListAsync(cancellationToken);

    public async Task<Cliente> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _clienteRepository.GetByIdAsync(id, cancellationToken)
           ?? throw new NotFoundException("Customer not found.");

    public async Task<Cliente> UpdateAsync(Guid id, string name, string email, string phone, CancellationToken cancellationToken = default)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Customer not found.");

        cliente.Update(name, email, phone);
        _clienteRepository.Update(cliente);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return cliente;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Customer not found.");

        _clienteRepository.Remove(cliente);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static void ValidateCreateInput(string cpf, string email, string telefone)
    {
        if (!IsValidCpf(cpf))
        {
            throw new BusinessException("Invalid CPF.");
        }

        if (!IsValidEmail(email))
        {
            throw new BusinessException("Invalid email.");
        }

        if (!IsValidPhone(telefone))
        {
            throw new BusinessException("Invalid phone number.");
        }
    }

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return false;
        }

        try
        {
            _ = new MailAddress(email.Trim());
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static bool IsValidPhone(string telefone)
    {
        if (string.IsNullOrWhiteSpace(telefone))
        {
            return false;
        }

        var digits = OnlyDigits(telefone);
        return PhoneRegex.IsMatch(digits);
    }

    private static string NormalizePhone(string telefone) => OnlyDigits(telefone);

    private static bool IsValidCpf(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
        {
            return false;
        }

        var digits = OnlyDigits(cpf);
        if (digits.Length != 11 || RepeatedDigitsRegex.IsMatch(digits))
        {
            return false;
        }

        var firstDigit = CalculateCpfDigit(digits[..9], 10);
        var secondDigit = CalculateCpfDigit($"{digits[..9]}{firstDigit}", 11);

        return digits.EndsWith($"{firstDigit}{secondDigit}");
    }

    private static int CalculateCpfDigit(string source, int weightStart)
    {
        var sum = 0;
        for (var i = 0; i < source.Length; i++)
        {
            sum += (source[i] - '0') * (weightStart - i);
        }

        var remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    private static string OnlyDigits(string input) => new(input.Where(char.IsDigit).ToArray());
}
