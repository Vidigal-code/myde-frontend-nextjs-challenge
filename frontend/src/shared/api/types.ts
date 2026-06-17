/**
 * Contratos da API fornecida (DTOs). São a fonte única de verdade dos tipos de domínio;
 * as `entities` reexportam estes tipos como modelo de domínio.
 */

export interface Conversation {
  id: string;
  contactName: string;
  contactPhone: string;
  avatarColor: string;
  unread: number;
  lastMessage: string;
  lastMessageAt: string;
}

export type MessageDirection = "in" | "out";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  direction: MessageDirection;
  body: string;
  status: MessageStatus;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
}

export type AiSuggestionSource = "openai" | "mock" | "mock-fallback";

export interface AiSuggestion {
  suggestion: string;
  source: AiSuggestionSource;
}
