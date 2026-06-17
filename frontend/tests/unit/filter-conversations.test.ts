import { describe, expect, it } from "vitest";

import { filterConversations } from "@/features/search-conversations/model";
import type { Conversation } from "@/entities/conversation/model";

function makeConversation(overrides: Partial<Conversation>): Conversation {
  return {
    id: "c-1",
    contactName: "Contato",
    contactPhone: "5511999990000",
    avatarColor: "#000000",
    unread: 0,
    lastMessage: "",
    lastMessageAt: "2026-06-11T10:00:00.000Z",
    ...overrides,
  };
}

const conversations: Conversation[] = [
  makeConversation({ id: "c-1", contactName: "Mariana Lopes", contactPhone: "5511988887766", lastMessage: "Minha internet caiu" }),
  makeConversation({ id: "c-2", contactName: "Antônio Júnior", contactPhone: "5511977776655", lastMessage: "Boleto em atraso" }),
  makeConversation({ id: "c-3", contactName: "Juliana Prado", contactPhone: "5511966665544", lastMessage: "Upgrade de plano" }),
];

describe("filterConversations", () => {
  it("retorna todas as conversas quando o termo está vazio", () => {
    expect(filterConversations(conversations, "")).toHaveLength(3);
    expect(filterConversations(conversations, "   ")).toHaveLength(3);
  });

  it("filtra por nome do contato (case-insensitive)", () => {
    const result = filterConversations(conversations, "mariana");
    expect(result.map((c) => c.id)).toEqual(["c-1"]);
  });

  it("é tolerante a acentos", () => {
    // "antonio junior" deve encontrar "Antônio Júnior"
    const result = filterConversations(conversations, "antonio junior");
    expect(result.map((c) => c.id)).toEqual(["c-2"]);
  });

  it("filtra por telefone", () => {
    const result = filterConversations(conversations, "96666");
    expect(result.map((c) => c.id)).toEqual(["c-3"]);
  });

  it("filtra pelo conteúdo da última mensagem", () => {
    const result = filterConversations(conversations, "internet");
    expect(result.map((c) => c.id)).toEqual(["c-1"]);
  });

  it("retorna lista vazia quando não há correspondência", () => {
    expect(filterConversations(conversations, "xyz-sem-match")).toEqual([]);
  });
});
