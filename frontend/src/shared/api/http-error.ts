import { AxiosError } from "axios";

/** Mensagem de erro amigável (PT-BR) derivada de qualquer falha de rede/HTTP. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiMessage = (error.response?.data as { error?: string } | undefined)?.error;
    if (apiMessage) return apiMessage;
    if (error.code === "ECONNABORTED") return "A requisição demorou demais. Tente novamente.";
    if (error.response?.status === 404) return "Recurso não encontrado.";
    if (error.response && error.response.status >= 500) {
      return "O servidor está com problemas. Tente novamente em instantes.";
    }
    if (!error.response) return "Sem conexão com o servidor. Verifique sua rede.";
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Ocorreu um erro inesperado.";
}
