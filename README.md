# Teste Técnico – Analista/Desenvolvedor Pleno

API REST para gerenciamento de **clientes**, **apartamentos**, **reservas** e **vendas**, desenvolvida com .NET 9, Entity Framework Core, SQL Server e Docker.

## Objetivo do projeto
Atender ao cenário de uma imobiliária/corretora com autenticação JWT e regras de negócio para reserva e venda de apartamentos.

---

## Tecnologias utilizadas
- .NET 9 (ASP.NET Core Web API)
- Entity Framework Core
- SQL Server
- Docker / Docker Compose
- Swagger / OpenAPI
- JWT Bearer Authentication

---

## Como executar o projeto

## Pré-requisitos
- .NET SDK 9
- SQL Server Express (local) **ou** Docker
- Docker Desktop (opcional, para execução containerizada)

## Opção 1: Executar localmente (com SQL Server Express)

> Se você não tiver SQL Server local instalado, pode subir **somente o banco** via Docker:

```powershell
docker compose up -d sqlserver
```

Para verificar se o banco está no ar:

```powershell
docker compose ps
```

Para parar/remover apenas o container do banco:

```powershell
docker compose stop sqlserver
docker compose rm -f sqlserver
```

1. Ajuste a connection string em `RealEstate/appsettings.Development.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=RealEstateDb;User Id=sa;Password=Senha@123456;TrustServerCertificate=True"
}
```

2. Aplicar migrations:

```powershell
dotnet ef database update --project Infrastructure/Infrastructure.csproj --startup-project RealEstate/RealEstate.Api.csproj
```

3. Executar API:

```powershell
dotnet run --project RealEstate/RealEstate.Api.csproj
```

4. Abrir Swagger:
- `https://localhost:7291/swagger` (ou URL/porta do perfil ativo)

## Opção 2: Executar com Docker (API + SQL Server)

```powershell
docker-compose up --build
```

Swagger:
- `https://localhost:8081/swagger`
- `http://localhost:8080/swagger`

---

## Estrutura das tabelas
Estrutura baseada na migration inicial em `Infrastructure/Migrations/20260603161843_InitialCreate.cs`.

## Clientes
- `Id` (uniqueidentifier, PK)
- `Nome` (nvarchar(150), obrigatório)
- `Cpf` (nvarchar(11), obrigatório, único)
- `Email` (nvarchar(200), obrigatório, único)
- `Telefone` (nvarchar(20), obrigatório)
- `DataCadastro` (datetime2, obrigatório)
- Campos de auditoria: `DataCriacao`, `DataAtualizacao`, `UsuarioCriacao`, `UsuarioAtualizacao`

## Apartamentos
- `Id` (uniqueidentifier, PK)
- `Numero` (nvarchar(10), obrigatório)
- `Bloco` (nvarchar(20), obrigatório)
- `Andar` (int, obrigatório)
- `Valor` (decimal(18,2), obrigatório)
- `Status` (int, obrigatório, default = 1)
- Campos de auditoria: `DataCriacao`, `DataAtualizacao`, `UsuarioCriacao`, `UsuarioAtualizacao`

Índices relevantes:
- `IX_Apartamentos_Bloco_Numero` (único)
- `IX_Apartamentos_Status`

## Reservas
- `Id` (uniqueidentifier, PK)
- `ClienteId` (FK -> `Clientes.Id`)
- `ApartamentoId` (FK -> `Apartamentos.Id`)
- `DataReserva` (datetime2)
- `Status` (int, default = 1)
- Campos de auditoria: `DataCriacao`, `DataAtualizacao`, `UsuarioCriacao`, `UsuarioAtualizacao`

Índices relevantes:
- `IX_Reservas_ClienteId`
- `IX_Reservas_ApartamentoId`
- `IX_Reservas_ApartamentoId_Status`

## Vendas
- `Id` (uniqueidentifier, PK)
- `ClienteId` (FK -> `Clientes.Id`)
- `ApartamentoId` (FK -> `Apartamentos.Id`, único)
- `DataVenda` (datetime2)
- `ValorVenda` (decimal(18,2))
- Campos de auditoria: `DataCriacao`, `DataAtualizacao`, `UsuarioCriacao`, `UsuarioAtualizacao`

Índices relevantes:
- `IX_Vendas_ClienteId`
- `IX_Vendas_ApartamentoId` (único)
- `IX_Vendas_DataVenda`

---

## Endpoints da API
> Todos os endpoints abaixo exigem token JWT, **exceto** login.

## Autenticação
- `POST /api/auth/login`

Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

## Clientes
- `POST /api/cliente` (criar)
- `GET /api/cliente` (listar)
- `GET /api/cliente/{id}` (consultar por id)
- `PUT /api/cliente/{id}` (atualizar)
- `DELETE /api/cliente/{id}` (excluir)

## Apartamentos
- `POST /api/apartamentos` (criar)
- `GET /api/apartamentos` (listar)
- `GET /api/apartamentos/{id}` (consultar por id)
- `PUT /api/apartamentos/{id}` (atualizar)
- `DELETE /api/apartamentos/{id}` (excluir)

## Reservas
- `POST /api/reservas` (criar)
- `GET /api/reservas` (listar)
- `PATCH /api/reservas/{id}/cancel` (cancelar)

## Vendas
- `POST /api/vendas` (registrar)
- `GET /api/vendas` (listar)

---

## Como gerar e usar o JWT

As configurações estão em `RealEstate/appsettings.json`:
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:SecretKey`
- `Jwt:ExpirationMinutes`
- `Jwt:Username`
- `Jwt:Password`

## Gerar token
1. Chame `POST /api/auth/login` com usuário/senha válidos.
2. A resposta retorna:

```json
{
  "token": "<jwt>"
}
```

## Usar token
Enviar no header:

```http
Authorization: Bearer <jwt>
```

No Swagger:
1. Clique em **Authorize**
2. Informe `Bearer <jwt>`
3. Execute os endpoints protegidos

---

## Regras de negócio implementadas

## Reserva
- Um apartamento só pode ser reservado se estiver **Disponível**.
- Ao reservar, o status do apartamento é alterado para **Reservado**.

## Venda
- Uma venda só pode ser registrada para apartamento **Reservado**.
- Ao concluir a venda:
  - registra a venda
  - altera o status do apartamento para **Vendido**
  - encerra a reserva associada

---

## Cenário de uso (fluxo)
1. Login do corretor
2. Cadastro do cliente
3. Consulta de apartamentos
4. Reserva do apartamento
5. Confirmação da venda
6. Atualização do status para Vendido

---

## Decisões técnicas adotadas
- Arquitetura em camadas: `Domain`, `Application`, `Infrastructure`, `RealEstate.Api`
- EF Core com Fluent API para mapeamentos e constraints
- Configuração base compartilhada de entidades (`ConfigureBaseEntity`) para reduzir repetição
- Repository + Unit of Work para acesso a dados
- JWT Bearer para proteção dos endpoints
- Swagger para documentação e testes manuais
- Migrations para versionamento do banco
- Tratamento de erros por exceções de domínio (`BusinessException`, `NotFoundException`)

---