import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

import { DEFAULT_STALE_MS } from "@/shared/config/constants";

/** Configuração única do QueryClient, compartilhada entre servidor e browser. */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_MS,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        // Inclui também queries "pending" na desidratação (streaming/prefetch).
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * No servidor: sempre um cliente novo por request (evita vazar dados entre usuários).
 * No browser: um singleton reutilizado entre renders.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
