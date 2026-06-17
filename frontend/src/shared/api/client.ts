import axios from "axios";

import { resolveApiBaseUrl } from "@/shared/config/env";
import type { Agent, AiSuggestion, Conversation, Message } from "@/shared/api/types";

/**
 * Cliente HTTP único da aplicação. A base URL é resolvida por runtime (browser vs servidor)
 * — veja `shared/config/env.ts`. A chave da OpenAI NUNCA chega ao browser: `/ai/suggest`
 * é um proxy server-side do backend fornecido.
 */
export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 20_000,
});

// ─── Endpoints (funções pequenas, tipadas e reutilizáveis) ────────────────────
export async function fetchMe(): Promise<Agent> {
  const { data } = await api.get<Agent>("/me");
  return data;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>("/conversations");
  return data;
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
  return data;
}

export async function postMessage(conversationId: string, text: string): Promise<Message> {
  const { data } = await api.post<Message>(`/conversations/${conversationId}/messages`, { text });
  return data;
}

export async function requestAiSuggestion(conversationId: string): Promise<AiSuggestion> {
  const { data } = await api.post<AiSuggestion>("/ai/suggest", { conversationId });
  return data;
}
