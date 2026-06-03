namespace Domain.Common
{
    public class Entity
    {
        public Guid Id { get; protected set; }

        public DateTime DataCriacao { get; protected set; }

        public DateTime DataAtualizacao { get; protected set; }

        public string UsuarioCriacao { get; protected set; } = string.Empty;

        public string UsuarioAtualizacao { get; protected set; } = string.Empty;

        protected Entity()
        {
            Id = Guid.NewGuid();
        }
    }
}