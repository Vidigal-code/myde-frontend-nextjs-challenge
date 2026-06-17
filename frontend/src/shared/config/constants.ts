/** Constantes de configuração — centralizadas para evitar "números mágicos" no código. */

/** Intervalo de polling da lista de conversas (mantém não-lidas/última msg atualizadas). */
export const CONVERSATIONS_POLL_MS = 8_000;

/** Intervalo de polling das mensagens da conversa aberta. */
export const MESSAGES_POLL_MS = 5_000;

/** Tempo até um dado ser considerado "stale" pelo React Query. */
export const DEFAULT_STALE_MS = 5_000;

/** Velocidade do efeito de digitação ao revelar a sugestão da IA (ms por "passo"). */
export const AI_TYPING_STEP_MS = 12;

/** Largura mínima (px) a partir da qual usamos o layout de duas colunas (desktop). */
export const DESKTOP_MIN_WIDTH = 1024;
