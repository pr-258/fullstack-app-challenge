# Sistema de Gestão de Férias

Aplicação full-stack para gerir colaboradores e pedidos de férias da TaskFlow.

## Stack

- Backend: Java 21, Spring Boot, PostgreSQL, Flyway, Swagger/OpenAPI.
- Frontend: Next.js, React, TanStack Query, Zustand, Tailwind CSS.
- Infra: Docker Compose.

## Funcionalidades

- Seleção de utilizador mockado para simular autenticação.
- Gestão de colaboradores, disponível para `ADMIN`.
- Gestão de pedidos de férias.
- Regras por role: `ADMIN`, `MANAGER`, `COLLABORATOR`.
- Aprovação/rejeição por `ADMIN` ou manager responsável.
- Cancelamento e edição de pedidos pendentes.
- Bloqueio de férias sobrepostas com datas inclusivas.
- Paginação e filtros suportados pela API.
- Documentação da API via Swagger.

## Regras e Assunções

- Todos os utilizadores ativos podem criar pedidos de férias.
- `ADMIN` pode gerir todos os utilizadores e todos os pedidos.
- `MANAGER` pode ver e aprovar/rejeitar apenas pedidos dos seus colaboradores.
- `COLLABORATOR` pode ver, criar, editar e cancelar apenas os seus próprios pedidos.
- Managers e admins podem criar pedidos próprios, mas não podem aprovar/rejeitar os seus próprios pedidos.
- Datas são inclusivas. Exemplo: `2026-08-01` a `2026-08-05` conta como 5 dias.
- Pedidos `PENDING` e `APPROVED` bloqueiam sobreposição de férias.
- Pedidos `REJECTED` e `CANCELLED` não bloqueiam períodos futuros.
- Apenas pedidos `PENDING` podem ser editados, aprovados, rejeitados ou cancelados.

## Correr com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

Parar os containers:

```bash
docker compose down
```

Limpar também a base de dados local:

```bash
docker compose down -v
```

## Utilizadores Mock

A aplicação inicia com utilizadores seeded. No frontend, basta escolher um utilizador em `http://localhost:3000/login`.

| Nome        | Role           | Manager     |
| ----------- | -------------- | ----------- |
| Ana Silva   | `ADMIN`        | -           |
| Bruno Costa | `MANAGER`      | -           |
| Carlos Dias | `MANAGER`      | -           |
| Diego Ramos | `COLLABORATOR` | Bruno Costa |
| Eva Santos  | `COLLABORATOR` | Bruno Costa |
| Fiona Lima  | `COLLABORATOR` | Carlos Dias |

## Testes

Backend:

```bash
cd backend
./mvnw test
```

Os testes usam Testcontainers, por isso o Docker deve estar em execução.

Frontend:

```bash
cd frontend
bun run lint
bun run typecheck
```

## Estrutura

```text
backend/    API Spring Boot, migrations, testes e Dockerfile do backend
frontend/   Aplicação Next.js e Dockerfile do frontend
docker-compose.yml   Setup full-stack recomendado para avaliação
```

Existe também `backend/docker-compose.yml` para desenvolvimento isolado do backend. Para avaliar a solução completa, usar o `docker-compose.yml` do root.
