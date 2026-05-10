# Backend API

API Spring Boot do sistema de gestao de ferias. Para correr a solucao completa com frontend, backend e PostgreSQL, consultar o `README.md` na raiz do projeto.

## Stack

- Java 21
- Spring Boot
- PostgreSQL
- Flyway
- Springdoc OpenAPI / Swagger UI
- JUnit 5, Rest-Assured e Testcontainers

## Correr apenas o backend

Criar o ficheiro de ambiente:

```bash
cp .env.example .env
```

Subir PostgreSQL e API a partir desta pasta:

```bash
docker compose up --build
```

URLs uteis:

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`
- Utilizadores mock: `http://localhost:8080/api/auth/mock-users`

Parar os containers:

```bash
docker compose down
```

Remover tambem o volume local da base de dados:

```bash
docker compose down -v
```

## Testes

Os testes de integracao usam Testcontainers, por isso o Docker deve estar em execucao.

```bash
./mvnw test
```

## Autenticacao mock

A autenticacao e simulada pelo header:

```http
X-Acting-User-Id: <user-id>
```

O endpoint `/api/auth/mock-users` devolve os utilizadores seeded que podem ser usados para simular `ADMIN`, `MANAGER` e `COLLABORATOR`.

## Regras de negocio

As regras de roles, ownership, datas inclusivas, sobreposicao de ferias e transicoes de status estao documentadas no `README.md` da raiz do projeto.

## Filtros

Utilizadores:

- `role`
- `managerId`
- `search`
- `page`, `size`, `sort`

Pedidos de ferias:

- `status`
- `collaboratorId`
- `managerId`
- `startDate`
- `endDate`
- `search`
- `page`, `size`, `sort`

Consultar o Swagger UI para detalhes dos endpoints, schemas e respostas de erro.
