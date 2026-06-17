import { describe, expect, it } from "vitest";

import { groupMessagesByDay } from "@/entities/message/lib/group-by-day";
import type { ChatMessage } from "@/entities/message/model";

function makeMessage(id: string, createdAt: string): ChatMessage {
  return { id, direction: "in", body: id, status: "read", createdAt };
}

describe("groupMessagesByDay", () => {
  it("retorna vazio para nenhuma mensagem", () => {
    expect(groupMessagesByDay([])).toEqual([]);
  });

  it("agrupa mensagens do mesmo dia em um único grupo", () => {
    const messages = [
      makeMessage("m1", "2026-06-11T09:00:00.000Z"),
      makeMessage("m2", "2026-06-11T11:42:00.000Z"),
    ];
    const groups = groupMessagesByDay(messages);
    expect(groups).toHaveLength(1);
    expect(groups[0].key).toBe("2026-06-11");
    expect(groups[0].messages.map((m) => m.id)).toEqual(["m1", "m2"]);
  });

  it("separa em grupos diferentes quando o dia muda", () => {
    const messages = [
      makeMessage("m1", "2026-06-10T18:30:00.000Z"),
      makeMessage("m2", "2026-06-11T09:00:00.000Z"),
      makeMessage("m3", "2026-06-11T10:00:00.000Z"),
    ];
    const groups = groupMessagesByDay(messages);
    expect(groups.map((g) => g.key)).toEqual(["2026-06-10", "2026-06-11"]);
    expect(groups[1].messages.map((m) => m.id)).toEqual(["m2", "m3"]);
  });

  it("preserva a ordem cronológica recebida", () => {
    const messages = [
      makeMessage("m1", "2026-06-11T09:00:00.000Z"),
      makeMessage("m2", "2026-06-12T09:00:00.000Z"),
      makeMessage("m3", "2026-06-11T09:00:00.000Z"),
    ];
    // Dois grupos de '11' separados por '12' — não deve mesclar grupos não-consecutivos.
    const groups = groupMessagesByDay(messages);
    expect(groups.map((g) => g.key)).toEqual(["2026-06-11", "2026-06-12", "2026-06-11"]);
  });
});
