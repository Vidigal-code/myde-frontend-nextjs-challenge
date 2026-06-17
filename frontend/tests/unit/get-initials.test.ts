import { describe, expect, it } from "vitest";

import { getInitials } from "@/shared/lib/get-initials";

describe("getInitials", () => {
  it("usa a primeira e a última palavra de um nome completo", () => {
    expect(getInitials("Mariana Lopes")).toBe("ML");
    expect(getInitials("Pedro Henrique Souza")).toBe("PS");
  });

  it("usa as duas primeiras letras quando há um só nome", () => {
    expect(getInitials("Rafael")).toBe("RA");
  });

  it("normaliza espaços extras", () => {
    expect(getInitials("  Juliana   Prado  ")).toBe("JP");
  });

  it("trata um único caractere", () => {
    expect(getInitials("a")).toBe("A");
  });

  it("retorna '?' para entrada vazia ou só espaços", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("   ")).toBe("?");
  });
});
