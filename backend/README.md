# Vacation Management API

Backend API para o desafio técnico de gestão de férias da TaskFlow. A aplicação gere utilizadores, pedidos de férias, regras de acesso por role, validação de sobreposição de datas e documentação da API.

## Main Stack

- Java 21
- Spring Boot
- PostgreSQL
- Flyway
- OpenAPI / Swagger UI
- Docker Compose
- JUnit 5 com Testcontainers

## Features

- CRUD de utilizadores para admins.
- Criação, listagem, detalhe, edição, aprovação, rejeição e cancelamento de pedidos de férias.
- Autenticação mock através do request header `X-Acting-User-Id`.
- Controlo de acesso por role: `ADMIN`, `MANAGER` e `COLLABORATOR`.
- Validação de intervalos de datas inclusivos.
- Bloqueio de períodos de férias ativos sobrepostos entre colaboradores.
- Paginação e filtros para utilizadores e pedidos de férias.
- Respostas de erro em JSON com formato consistente.
- Documentação Swagger/OpenAPI.

## Regras de Negócio

- Admins podem gerir todos os utilizadores e todos os pedidos de férias.
- Managers podem ver e aprovar/rejeitar apenas pedidos dos seus colaboradores.
- Collaborators podem ver, criar, editar e cancelar apenas os seus próprios pedidos.
- Todos os utilizadores ativos podem criar pedidos de férias.
- Managers e admins também podem criar pedidos de férias, mas não podem aprovar ou rejeitar os seus próprios pedidos.
- As datas de férias são inclusivas. Por exemplo, `2026-08-01` a `2026-08-05` conta como 5 dias.
- Pedidos com estado `PENDING` e `APPROVED` bloqueiam períodos de férias sobrepostos.
- Pedidos com estado `REJECTED` e `CANCELLED` não bloqueiam períodos futuros.
- Apenas pedidos `PENDING` podem ser editados, aprovados, rejeitados ou cancelados.

## Utilizadores Mock

A base de dados é inicializada com utilizadores para testar os fluxos de roles:

| Nome        | Role           | User ID                                | Manager     |
| ----------- | -------------- | -------------------------------------- | ----------- |
| Ana Silva   | `ADMIN`        | `00000000-0000-0000-0000-000000000001` | -           |
| Bruno Costa | `MANAGER`      | `00000000-0000-0000-0000-000000000002` | -           |
| Carlos Dias | `MANAGER`      | `00000000-0000-0000-0000-000000000003` | -           |
| Diego Ramos | `COLLABORATOR` | `00000000-0000-0000-0000-000000000004` | Bruno Costa |
| Eva Santos  | `COLLABORATOR` | `00000000-0000-0000-0000-000000000005` | Bruno Costa |
| Fiona Lima  | `COLLABORATOR` | `00000000-0000-0000-0000-000000000006` | Carlos Dias |

## Executar com Docker

Criar o ficheiro de ambiente:

```bash
cp .env.example .env
```

Iniciar PostgreSQL e backend:

```bash
docker compose up --build
```

URLs úteis:

- API root: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`
- Utilizadores mock: `http://localhost:8080/api/auth/mock-users`

Parar os containers:

```bash
docker compose down
```

Limpar o volume local da base de dados:

```bash
docker compose down -v
```

## Executar Testes

O Docker deve estar em execução porque os testes de integração usam Testcontainers com PostgreSQL.

```bash
./mvnw test
```

## Uso da API

A autenticação é simulada através do request header `X-Acting-User-Id`. Usa um dos IDs dos utilizadores mock da tabela acima para simular o utilizador autenticado.

Para detalhes dos endpoints, schemas de request/response e testes manuais, usar o Swagger UI:

- `http://localhost:8080/swagger-ui.html`

## Filtros

Os utilizadores podem ser filtrados por:

- `role`
- `managerId`
- `search`
- parâmetros de paginação do Spring, como `page`, `size` e `sort`

Os pedidos de férias podem ser filtrados por:

- `status`
- `collaboratorId`
- `managerId`
- `startDate`
- `endDate`
- `search`
- parâmetros de paginação do Spring, como `page`, `size` e `sort`
