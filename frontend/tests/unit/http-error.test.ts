import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { toErrorMessage } from "@/shared/api/http-error";

function axiosErrorWith(response?: { status: number; data?: unknown }, code?: string): AxiosError {
  return new AxiosError(
    "erro",
    code,
    undefined,
    undefined,
    response ? ({ status: response.status, data: response.data } as never) : undefined,
  );
}

describe("toErrorMessage", () => {
  it("prioriza a mensagem de erro vinda da API", () => {
    const error = axiosErrorWith({ status: 404, data: { error: "conversa não encontrada" } });
    expect(toErrorMessage(error)).toBe("conversa não encontrada");
  });

  it("trata timeout (ECONNABORTED)", () => {
    const error = axiosErrorWith(undefined, "ECONNABORTED");
    expect(toErrorMessage(error)).toMatch(/demorou/i);
  });

  it("trata 404 sem corpo", () => {
    const error = axiosErrorWith({ status: 404 });
    expect(toErrorMessage(error)).toMatch(/não encontrado/i);
  });

  it("trata erro 5xx do servidor", () => {
    const error = axiosErrorWith({ status: 503 });
    expect(toErrorMessage(error)).toMatch(/servidor/i);
  });

  it("trata ausência de resposta (sem rede)", () => {
    const error = axiosErrorWith(undefined, "ERR_NETWORK");
    expect(toErrorMessage(error)).toMatch(/conexão/i);
  });

  it("usa a mensagem de um Error comum", () => {
    expect(toErrorMessage(new Error("algo falhou"))).toBe("algo falhou");
  });

  it("tem fallback para valores desconhecidos", () => {
    expect(toErrorMessage("string solta")).toBe("Ocorreu um erro inesperado.");
  });
});
