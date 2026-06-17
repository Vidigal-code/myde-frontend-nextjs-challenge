import { describe, expect, it } from "vitest";

import { dayKey, formatRelativeTime, formatTime } from "@/shared/lib/format-time";

describe("dayKey", () => {
  it("extrai a data (YYYY-MM-DD) em UTC", () => {
    expect(dayKey("2026-06-11T11:42:00.000Z")).toBe("2026-06-11");
  });

  it("retorna string vazia para datas inválidas", () => {
    expect(dayKey("não é data")).toBe("");
  });
});

describe("formatRelativeTime", () => {
  it("retorna 'agora' para instantes muito próximos", () => {
    const dezSegundosAtras = new Date(Date.now() - 10_000);
    expect(formatRelativeTime(dezSegundosAtras)).toBe("agora");
  });

  it("retorna string vazia para entrada inválida", () => {
    expect(formatRelativeTime("xyz")).toBe("");
  });
});

describe("formatTime", () => {
  it("retorna string vazia para entrada inválida", () => {
    expect(formatTime("xyz")).toBe("");
  });

  it("formata um horário no padrão HH:MM", () => {
    // Independente de fuso: apenas garante o formato de duas casas separadas por ':'.
    expect(formatTime("2026-06-11T11:42:00.000Z")).toMatch(/^\d{2}:\d{2}$/);
  });
});
