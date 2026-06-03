using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Reserva : Entity
    {
        public Guid ClienteId { get; private set; }

        public Guid ApartamentoId { get; private set; }

        public DateTime DataReserva { get; private set; }

        public ReservaStatus Status { get; private set; }

        public Cliente Cliente { get; private set; } = null!;

        public Apartamento Apartamento { get; private set; } = null!;

        protected Reserva()
        {
        }

        public Reserva(Guid clienteId,
                       Guid apartamentoId)
        {
            ClienteId = clienteId;
            ApartamentoId = apartamentoId;
            DataReserva = DateTime.UtcNow;
            Status = ReservaStatus.Active;
        }

        public void Cancel()
        {
            if (Status != ReservaStatus.Active)
                throw new InvalidOperationException(
                    "Reservation cannot be canceled.");

            Status = ReservaStatus.Canceled;
        }

        public void Close()
        {
            Status = ReservaStatus.Closed;
        }
    }
}
