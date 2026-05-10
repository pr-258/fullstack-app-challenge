# Sistema de Gestão de Férias

Aplicação full-stack para gerir colaboradores e pedidos de férias da TaskFlow.

## Stack

- Backend: Java 21, Spring Boot, PostgreSQL, Flyway, Swagger/OpenAPI.
- Frontend: Next.js, React, TanStack Query, Zustand, Tailwind CSS.
- Infra: Docker Compose.

## Funcionalidades core

- Seleção de utilizador mockado para simular autenticação.
- Gestão de colaboradores, disponível para `ADMIN`.
- Gestão de pedidos de férias.
- Regras por role: `ADMIN`, `MANAGER`, `COLLABORATOR`.
- Aprovação/rejeição por `ADMIN` ou manager responsável.
- Cancelamento e edição de pedidos pendentes.
- Bloqueio de férias sobrepostas com datas inclusivas.
- Documentação da API via Swagger.

## Funcionalidades bonus implementadas

- Simulação de autenticação via seleção de utilizador no frontend (`/login`), com header `X-Acting-User-Id` enviado em cada pedido e validação de role no backend.
- Paginação e filtros suportados pela API e frontend.
- Endpoint dedicado de estatísticas para o dashboard, com scope por role.
- Visualização em calendário dos períodos de férias (aprovados e pendentes).

## Regras e Assunções

- Todos os utilizadores ativos podem criar pedidos de férias.
- `ADMIN` pode gerir todos os utilizadores e todos os pedidos.
- `MANAGER` pode ver e aprovar/rejeitar apenas pedidos dos seus colaboradores.
- `COLLABORATOR` pode ver, criar, editar e cancelar apenas os seus próprios pedidos.
- `MANAGER` pode criar o seu próprio pedido de férias; este aparece na sua lista juntamente com os pedidos da sua equipa, mas só pode ser aprovado/rejeitado por um `ADMIN` (managers não têm manager acima deles).
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

| Nome            | Role           | Manager     |
| --------------- | -------------- | ----------- |
| Ana Silva       | `ADMIN`        | -           |
| Bruno Costa     | `MANAGER`      | -           |
| Carlos Dias     | `MANAGER`      | -           |
| Diana Fernandes | `MANAGER`      | -           |
| Diego Ramos     | `COLLABORATOR` | Bruno Costa |
| Eva Santos      | `COLLABORATOR` | Bruno Costa |
| Fiona Lima      | `COLLABORATOR` | Carlos Dias |

A base de dados inclui 15 utilizadores no total (1 admin, 3 managers, 11 colaboradores) e 25 pedidos de férias para facilitar o teste de paginação e filtros.

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
backend/              API Spring Boot, migrations, testes e Dockerfile
├── README.md         overview do backend
frontend/             Aplicação Next.js
├── README.md         overview do frontend
docker-compose.yml    Setup full-stack recomendado para avaliação
```

Existe também `backend/docker-compose.yml` para desenvolvimento isolado do backend. Para avaliar a solução completa, usar o `docker-compose.yml` do root.

## Decisões de Arquitetura

**Monorepo**

Optei por um monorepo simples com `backend/` e `frontend/` na mesma raiz. Para um exercício time-boxed faz sentido: um único `docker-compose.yml` orquestra tudo, o setup é imediato para quem avalia, e não há overhead de múltiplos repositórios sem um pipeline CI/CD que o justifique. Numa aplicação de produção separaria os dois em repositórios independentes.

**Autenticação por acting user**

O enunciado torna a autenticação opcional. Em vez de implementar um fluxo JWT/OAuth completo — que consumiria uma parte significativa do tempo disponível — optei por um padrão de "acting user": o frontend envia um header `X-Acting-User-Id` em cada pedido, e o backend valida o utilizador e aplica todas as regras de autorização por role. A segurança não está apenas no frontend; o backend rejeita pedidos sem utilizador válido e aplica os mesmos controlos independentemente da origem. Esta abordagem permite ao avaliador alternar entre roles instantaneamente e testar todos os cenários sem fricção.

## Se tivesse mais tempo

- **Autenticação real** — substituir o header mock por Spring Security com JWT; o backend já tem a estrutura de roles e ownership para suportar isso sem grandes alterações.
- **Testes unitários no backend** — os testes atuais são de integração com Testcontainers e cobrem os fluxos principais, mas faltam testes unitários às services com mocks para cobrir edge cases de forma mais isolada e rápida.
- **Logging estruturado** — adicionar SLF4J/Logback configurado com níveis por package e correlação de pedidos; atualmente não há logging nos services ou controllers.
- **Notificações** — enviar email ao colaborador quando o pedido é aprovado ou rejeitado; o backend tem o `reviewedBy` e `reviewedAt` mas não notifica ninguém.
- **Testes no frontend** — o backend já tem testes de integração que cobrem a camada de API com base de dados real; o que falta são testes E2E com Playwright para validar fluxos completos do browser até à base de dados (ex: login como colaborador, criar pedido, trocar para manager, aprovar, verificar estado na tabela), e testes de componente com React Testing Library para regras de UI dependentes de role (ex: manager não vê os botões de aprovar/rejeitar no seu próprio pedido).
- **Feedback de erros no frontend** — os erros de mutação são apresentados inline; um sistema de toasts seria mais consistente e menos intrusivo.
