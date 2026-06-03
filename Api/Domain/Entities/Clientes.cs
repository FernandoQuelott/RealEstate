using Domain.Common;

namespace Domain.Entities
{
    public class Cliente : Entity
    {
        public string Nome { get; private set; } = null!;

        public string Cpf { get; private set; } = null!;

        public string Email { get; private set; } = null!;

        public string Telefone { get; private set; } = null!;

        public DateTime DataCadastro { get; private set; }

        protected Cliente()
        {
        }

        public Cliente(string nome,
                       string cpf,
                       string email,
                       string telefone)
        {
            Nome = nome;
            Cpf = cpf;
            Email = email;
            Telefone = telefone;
            DataCadastro = DateTime.UtcNow;
        }

        public void Update(
            string nome,
            string email,
            string telefone)
        {
            Nome = nome;
            Email = email;
            Telefone = telefone;
        }
    }
}
