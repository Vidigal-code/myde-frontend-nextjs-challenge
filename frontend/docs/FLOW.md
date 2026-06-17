# Fluxos do Projeto — Inbox de Atendimento

Documentação dos fluxos principais (arquitetura, dados e UX). Os diagramas usam **Mermaid**
(renderizam direto no GitHub). Para o "como rodar" e as decisões resumidas, veja o
[`README.md`](../README.md).

---

## 1. Arquitetura FSD — direção das dependências

Cada camada só pode importar das camadas **abaixo** dela. Isso elimina dependências circulares
e mantém `entities`/`features` reutilizáveis e testáveis.

```mermaid
flowchart TD
    A["app/ (rotas + prefetch SSR)"] --> W["widgets/ (app-shell · conversation-list · chat)"]
    W --> F["features/ (send-message · ai-suggest · search-conversations)"]
    F --> E["entities/ (agent · conversation · message)"]
    E --> S["shared/ (api · ui · lib · hooks · store · config)"]
    W -.-> E
    W -.-> S
    F -.-> S

    classDef layer fill:#1f2937,stroke:#374151,color:#f9fafb;
    class A,W,F,E,S layer;
```

| Camada | Responsabilidade | Exemplos |
|--------|------------------|----------|
| `app` | Roteamento fino + prefetch SSR | `layout.tsx`, `c/[id]/page.tsx` |
| `widgets` | Composição de tela | `app-shell`, `conversation-list`, `chat` |
| `features` | Casos de uso com interação | envio otimista, sugestão de IA, busca |
| `entities` | Modelo de domínio + UI "burra" | `agent`, `conversation`, `message` |
| `shared` | Base reutilizável | cliente Axios, shadcn/ui, utilitários |

---

## 2. Boot da aplicação — SSR + hidratação (sem waterfall)

A primeira pintura já chega com dados: o **Server Component** faz o prefetch e desidrata o cache
do React Query; o cliente hidrata sem refazer as buscas.

```mermaid
sequenceDiagram
    participant B as Browser
    participant L as layout.tsx (Server)
    participant Q as QueryClient (server)
    participant API as API (API_URL_INTERNAL)
    participant H as HydrationBoundary (client)

    B->>L: GET /c/c-1001
    L->>Q: prefetch me + conversations
    L->>API: GET /me, GET /conversations
    API-->>L: dados
    Note over L: page.tsx também faz prefetch de messages(id)
    L-->>B: HTML + estado desidratado (já com o contato renderizado)
    B->>H: hidrata o QueryClient do browser
    H-->>B: UI interativa, sem refetch inicial
```

> Verificado: `curl http://localhost:3000/c/c-1001` retorna o HTML já contendo o nome do contato.

---

## 3. Envio de mensagem — update otimista

A bolha aparece **imediatamente** (status "enviando"); em erro há rollback, e a resposta do
servidor substitui a mensagem temporária. Código: `features/send-message/use-send-message.ts`.

```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as MessageComposer
    participant M as useSendMessage
    participant Cache as React Query Cache
    participant API as API

    U->>C: digita + Enter
    C->>M: mutate(texto)
    M->>Cache: onMutate — adiciona bolha temporária (pending)
    M->>Cache: atualiza prévia da conversa + reordena
    M->>API: POST /conversations/:id/messages
    alt sucesso
        API-->>M: mensagem confirmada
        M->>Cache: onSuccess — substitui temporária pela real
    else erro
        API-->>M: falha
        M->>Cache: onError — rollback (snapshot anterior)
    end
    M->>Cache: onSettled — invalida messages + conversations
```

---

## 4. Sugestão de IA — `/ai/suggest`

O botão chama o backend (que faz o proxy da OpenAI — a chave nunca chega ao browser) e a sugestão
é "digitada" no campo com um efeito leve de revelação. Código: `features/ai-suggest/use-ai-suggest.ts`.

```mermaid
sequenceDiagram
    participant U as Usuário
    participant Btn as SuggestButton
    participant H as useAiSuggest
    participant API as API (proxy OpenAI)
    participant D as Draft (Zustand)

    U->>Btn: clica "Sugerir com IA"
    Btn->>H: suggest()
    H->>API: POST /ai/suggest { conversationId }
    API-->>H: { suggestion, source }
    H->>D: revela o texto (efeito de digitação)
    H-->>Btn: exibe badge de origem (OpenAI / heurística)
```

---

## 5. Atualização ao vivo — polling do React Query

```mermaid
flowchart LR
    subgraph RQ["React Query"]
      A["useConversations<br/>refetchInterval 8s"]
      B["useMessages(id)<br/>refetchInterval 5s (enabled)"]
    end
    A -->|GET /conversations| API[(API)]
    B -->|GET /:id/messages| API
    API -->|atualiza cache| UI["Lista + Chat re-renderizam"]
```

> Decisão: o backend fornecido expõe apenas REST; polling é suficiente e robusto. Evolução possível:
> SSE via *route handler* BFF (a flag `failed` no modelo de mensagem já prepara o reenvio).

---

## 6. Roteamento responsivo — master-detail

Uma rota define o que aparece; o CSS define a visibilidade por breakpoint. Código:
`widgets/app-shell/ui/app-shell.tsx`.

```mermaid
flowchart TD
    R{rota atual}
    R -->|"/"| Home["lista (mobile) · lista + placeholder (desktop)"]
    R -->|"/c/:id"| Chat["chat (mobile, tela cheia) · lista + chat (desktop)"]

    subgraph MOBILE["< 1024px — uma coluna"]
      direction LR
      m1["/  → Lista + hambúrguer (Sheet)"]
      m2["/c/:id → Chat + voltar"]
    end
    subgraph DESKTOP[">= 1024px — duas colunas"]
      direction LR
      d1["Lista fixa (clamp 300–400px)"]
      d2["Detalhe (placeholder ou chat)"]
    end
    Home --- MOBILE
    Chat --- DESKTOP
```

Validado de **280px (Galaxy Z Fold)** ao desktop: sem overflow horizontal, `truncate` em nomes/mensagens
e alvos de toque adequados.

---

## 7. Camada de dados — um cliente, base URL por runtime

```mermaid
flowchart TD
    subgraph SH["shared/api"]
      EP["endpoints (fetchMe, fetchConversations, ...)"]
      CL["client.ts (Axios)"]
      ENV["config/env.ts — resolveApiBaseUrl()"]
    end
    EP --> CL --> ENV
    ENV -->|browser| PUB["NEXT_PUBLIC_API_URL (ex.: localhost:4000)"]
    ENV -->|servidor/Docker| INT["API_URL_INTERNAL (ex.: api:4000)"]
```

Resolve o clássico problema de URL dupla em SSR dentro de containers: o navegador e o servidor
alcançam a API por caminhos diferentes, mas pelo mesmo código.
