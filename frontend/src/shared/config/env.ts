/**
 * Resolução da base URL da API por runtime — sem hardcode espalhado pelo código.
 *
 * - No **browser** usamos `NEXT_PUBLIC_API_URL` (precisa ser alcançável pelo navegador,
 *   ex.: `http://localhost:4000` no Docker local, ou a URL hospedada na AWS).
 * - No **servidor** (Server Components / Route Handlers dentro do container) preferimos
 *   `API_URL_INTERNAL` (ex.: `http://api:4000` na rede do Docker), com fallback para a pública.
 *
 * Para a API hospedada, ambas as variáveis coincidem e tudo "simplesmente funciona".
 */

const DEFAULT_API_URL = "http://localhost:4000";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;

/** True quando o código roda no servidor (sem `window`). */
const isServer = typeof window === "undefined";

export function resolveApiBaseUrl(): string {
  if (isServer) {
    return process.env.API_URL_INTERNAL?.trim() || PUBLIC_API_URL;
  }
  return PUBLIC_API_URL;
}

export const env = {
  apiBaseUrl: resolveApiBaseUrl(),
  isServer,
} as const;
