# Inbox de Atendimento WhatsApp — Frontend

Painel de atendimento via WhatsApp com sugestões de IA, construído sobre a API fornecida.
**Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui + Zustand + React Query + Axios**,
organizado em **Feature-Sliced Design (FSD)** e 100% responsivo (de ~280px / Galaxy Z Fold ao desktop).

---

## 🚀 Como rodar

### Opção A — Docker (sobe tudo: frontend + backend local)

Da **raiz do repositório**:

```bash
docker compose up --build
# Frontend: http://localhost:3000
# API local (store em memória): http://localhost:4000
```

A URL da API é lida do `.env` da raiz (veja `envexample.txt`). Por padrão, o frontend conversa
com o backend local deste compose. Para usar a API hospedada na AWS, ajuste as variáveis no `.env`.

### Opção B — Local (sem Docker)

```bash
cd frontend
npm install
npm run dev            # http://localhost:3000
```

O `.env` da raiz já aponta para o backend. Para rodar o backend localmente:
`cd server && node local.mjs` (porta 4000).

### Scripts

| Script | O que faz |
|--------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção (saída `standalone` para Docker) |
| `npm run start` | Servidor de produção |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

---

## 🏛️ Arquitetura

### Feature-Sliced Design (`src/`)

Tudo (inclusive o App Router em `src/app`) vive sob `src/`, em camadas com dependência apenas
"para baixo": **`app → widgets → features → entities → shared`**.

```
src/
  app/          # App Router (rotas finas + prefetch SSR) + providers + globals.css
  shared/       # base reutilizável: api (axios + endpoints + query-keys), config (env/constantes),
                #   lib (cn, datas, iniciais), ui (shadcn), hooks, store (UI)
  entities/     # agent · conversation · message — tipos, hooks de query e UI "burra"
  features/     # search-conversations · send-message (otimista) · ai-suggest
  widgets/      # app-shell (layout responsivo) · conversation-list · chat
```

Cada `feature`/`entity` isola responsabilidade (SRP), é reutilizável e testável, sem dependências
circulares e com fronteira explícita entre **Server** e **Client Components**.

### Server vs Client Components

- `src/app/layout.tsx` e `src/app/c/[id]/page.tsx` são **Server Components** que fazem **prefetch**
  (`me`, `conversations`, `messages`) e entregam um `HydrationBoundary` — primeira pintura com dados,
  **sem waterfall** no cliente. (Verificado: o HTML do chat já chega com o nome do contato renderizado.)
- A interatividade (busca, composição, IA, polling, scroll) fica em **Client Components** mínimos.

### Data fetching & estado

- **React Query** cuida do *server state*: `useConversations` e `useMessages` com **polling**
  (8s / 5s) para manter lista, não-lidas e chat atualizados — escolha pragmática pedida pelo
  desafio (sem o custo/complexidade de WebSocket/SSE num backend que não os expõe).
- **Optimistic update** no envio (`use-send-message.ts`): a bolha aparece na hora com status
  "enviando", há **rollback** em erro e **reconciliação** com a resposta do servidor; `onSettled`
  invalida `messages` + `conversations` para consistência eventual.
- **Query keys** centralizadas (`shared/api/query-keys.ts`) — zero strings duplicadas.

### Zustand (apenas estado de UI)

Separado do server state: menu mobile (`ui-store`), termo de busca (`search-conversations`) e
**rascunho por conversa** (`draft-store`, preserva o texto ao alternar conversas).

### IA (`/ai/suggest`)

`useAiSuggest` busca a sugestão e a "digita" no campo com um efeito leve de revelação, exibindo a
**origem** (OpenAI / heurística). A chave da OpenAI nunca toca o browser — o backend faz o proxy.

### Base URL por runtime (Next + Docker)

`shared/config/env.ts` resolve a URL da API conforme o ambiente: o **browser** usa
`NEXT_PUBLIC_API_URL`; o **servidor/Docker** usa `API_URL_INTERNAL` (`http://api:4000`). Isso evita
o clássico problema de URL dupla em SSR dentro de containers.

### UX, responsividade e acessibilidade

- Layout **master-detail**: no mobile, lista em `/` e chat em `/c/[id]` (com voltar) + menu
  hambúrguer (Sheet); no desktop (lg+), duas colunas. Testado de 280px ao desktop.
- Estados de **loading** (skeletons), **erro** (com "tentar novamente") e **vazio** dedicados.
- Landmarks semânticas, `role="log"` + `aria-live` na thread, `aria-current` na conversa ativa,
  navegação por teclado (Enter envia, Shift+Enter quebra linha) e tema claro/escuro.

---

## 🔧 Decisões & trade-offs

- **Polling em vez de SSE/WebSocket**: o backend fornecido só expõe REST; polling do React Query é
  suficiente, simples e robusto. Trocar por SSE exigiria um *route handler* BFF — fica como evolução.
- **shadcn/ui "vendorizado"** em `shared/ui`: componentes copiados (Radix + Tailwind), sem depender
  da CLII/registry em build offline/Docker — leve e previsível.
- **Datas com `Intl`** nativo (sem `date-fns`/`dayjs`) para manter o bundle enxuto.

## ⏭️ O que eu faria com mais tempo

- **Tempo real** via SSE (route handler BFF) ou WebSocket, substituindo o polling.
- **Testes**: unitários do filtro e do reducer otimista; e2e (Playwright) dos fluxos principais.
- **Virtualização** da thread para conversas muito longas.
- **Reenvio** de mensagens que falharam (a flag `failed` já existe no modelo) e indicador de digitação.

---

## 📚 Documentação de fluxos

Diagramas (Mermaid, renderizam no GitHub) dos principais fluxos — arquitetura FSD, SSR + hidratação,
envio otimista, sugestão de IA, polling e roteamento responsivo:

➡️ [`docs/FLOW.md`](docs/FLOW.md)

---

## ✅ O que foi feito

### Requisitos do desafio
- [x] **Lista de conversas** — contato, última mensagem, horário relativo, badge de não-lidas e
      busca por nome/telefone/mensagem (tolerante a acentos).
- [x] **Tela de chat** — bolhas in/out, timestamps, divisores por dia e status estilo WhatsApp.
- [x] **Envio com update otimista** — bolha imediata (status "enviando"), rollback em erro e
      reconciliação com a resposta do servidor.
- [x] **Sugerir resposta com IA** (`/ai/suggest`) — preenche o campo com efeito de digitação e
      exibe a origem (OpenAI / heurística); a chave nunca chega ao browser.
- [x] **Estados** de loading (skeletons), erro (com "tentar novamente") e vazio dedicados.
- [x] **Atualização** via polling do React Query, com cache/invalidação dirigida e **sem waterfalls**
      (prefetch SSR + `HydrationBoundary`).
- [x] **Acessibilidade** — `role="log"` + `aria-live`, `aria-current`, foco e navegação por teclado.

### Engenharia
- [x] **FSD** (`app → widgets → features → entities → shared`), tudo sob `src/`, com SRP e sem ciclos.
- [x] **Server vs Client Components** conscientes; **React Query** (server state) separado do
      **Zustand** (UI: menu, busca, rascunho por conversa).
- [x] **Axios** com **base URL por runtime** (browser vs Docker), **query keys** centralizadas,
      **erros HTTP** normalizados, funções pequenas e reutilizáveis (sem hardcodes/duplicação).
- [x] **Tailwind v4 + shadcn/ui** (vendorizado), tema claro/escuro, ícones `lucide-react`.
- [x] **100% responsivo** — master-detail, hambúrguer/Sheet no mobile, duas colunas no desktop;
      validado de **280px (Galaxy Z Fold)** ao desktop.

### Docker & infra
- [x] **`Dockerfile`** multi-stage com saída **standalone** (imagem enxuta).
- [x] **`docker compose up --build`** sobe **frontend (:3000) + backend local (:4000)**.
- [x] `.env` na raiz + dual-URL (`NEXT_PUBLIC_API_URL` / `API_URL_INTERNAL`).

### Verificações executadas (todas verdes)
| Check | Resultado |
|-------|-----------|
| `tsc --noEmit` | ✅ sem erros |
| `next build` | ✅ `/` static · `/c/[id]` SSR · ~103–174 kB |
| `next lint` | ✅ sem avisos |
| Standalone `node server.js` | ✅ HTTP 200, SSR renderiza o contato |
| `docker compose up --build` | ✅ web alcança `api` na rede; POST de mensagem persiste |
