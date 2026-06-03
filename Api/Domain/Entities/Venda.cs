using Domain.Common;

namespace Domain.Entities
{
    public class Venda : Entity
    {
        public Guid ClienteId { get; private set; }

        public Guid ApartamentoId { get; private set; }

        public DateTime DataVenda { get; private set; }

        public decimal ValorVenda { get; private set; }

        public Cliente Cliente { get; private set; } = null!;

        public Apartamento Apartamento { get; private set; } = null!;

        protected Venda()
        {
        }

        public Venda(Guid clienteId,
                     Guid apartamentoId,
                     decimal valorVenda)
        {
            ClienteId = clienteId;
            ApartamentoId = apartamentoId;
            ValorVenda = valorVenda;
            DataVenda = DateTime.UtcNow;
        }
    }
}
