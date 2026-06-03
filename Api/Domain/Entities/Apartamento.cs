using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Apartamento : Entity
    {
        public string Numero { get; private set; }

        public string Bloco { get; private set; }

        public int Andar { get; private set; }

        public decimal Valor { get; private set; }

        public ApartamentoStatus Status { get; private set; }

        protected Apartamento()
        {
        }

        public Apartamento(string numero,
                           string bloco,
                           int andar,
                           decimal valor)
        {
            Numero = numero;
            Bloco = bloco;
            Andar = andar;
            Valor = valor;
            Status = ApartamentoStatus.Available;
        }

        public void Reserve()
        {
            if (Status != ApartamentoStatus.Available)
                throw new InvalidOperationException(
                    "Apartment is not available.");

            Status = ApartamentoStatus.Reserved;
        }

        public void ReleaseReservation()
        {
            if (Status != ApartamentoStatus.Reserved)
                throw new InvalidOperationException(
                    "Apartment is not reserved.");

            Status = ApartamentoStatus.Available;
        }

        public void Sell()
        {
            if (Status != ApartamentoStatus.Reserved)
                throw new InvalidOperationException(
                    "Apartment must be reserved before selling.");

            Status = ApartamentoStatus.Sold;
        }

        public void Update(
            string numero,
            string bloco,
            int andar,
            decimal valor)
        {
            Numero = numero;
            Bloco = bloco;
            Andar = andar;
            Valor = valor;
        }
    }
}
