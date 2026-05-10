# Frontend

Aplicacao Next.js para gerir utilizadores e pedidos de ferias. Para correr a solucao completa com Docker, consultar o `README.md` na raiz do projeto.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui e Hugeicons
- TanStack Query
- Zustand
- React Hook Form e Zod

## Configuracao local

Criar o ficheiro de ambiente:

```bash
cp .env.local.example .env.local
```

Valor esperado para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Instalar dependencias:

```bash
bun install
```

Subir o frontend:

```bash
bun run dev
```

A aplicacao fica disponivel em:

- `http://localhost:3000/login`

## Scripts

```bash
bun run lint
bun run typecheck
bun run build
bun run start
```

## Autenticacao mock

O login usa os utilizadores seeded devolvidos pelo backend em `/api/auth/mock-users`.

Depois de selecionar um utilizador, o frontend guarda a sessao mock localmente e envia o header `X-Acting-User-Id` nas chamadas protegidas da API.

## Estrutura

```text
app/                rotas e layouts (Next.js App Router)
├── (auth)/         páginas públicas (login)
└── (root)/         páginas protegidas (dashboard, users, vacation-requests, calendar)
api/
├── client/         configuração e fetcher HTTP centralizado
└── resources/      funções tipadas por recurso da API
components/         componentes de UI reutilizáveis e componentes por feature
hooks/              lógica extraída das páginas
queries/            hooks e query keys do TanStack Query
stores/             estado persistido com Zustand (acting user)
types/              tipos TypeScript partilhados
```
