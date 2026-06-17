/**
 * Factory central de query keys do React Query. Evita strings soltas/duplicadas e mantém
 * a invalidação de cache consistente em toda a aplicação.
 */
export const queryKeys = {
  me: ["me"] as const,
  conversations: ["conversations"] as const,
  messages: (conversationId: string) => ["messages", conversationId] as const,
};
