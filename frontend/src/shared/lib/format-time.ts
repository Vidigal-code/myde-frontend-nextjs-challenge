/**
 * Formatação de datas/horas com `Intl` nativo (sem dependências externas).
 * Tudo em PT-BR e tolerante a entradas inválidas.
 */

const LOCALE = "pt-BR";

const timeFormatter = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit" });
const dayFormatter = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "long", year: "numeric" });
const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

function toDate(input: string | number | Date): Date | null {
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "14:32" — usado no rodapé das bolhas de mensagem. */
export function formatTime(input: string | number | Date): string {
  const date = toDate(input);
  return date ? timeFormatter.format(date) : "";
}

/** "Hoje" / "Ontem" / "11 de junho de 2026" — divisor de dia na thread. */
export function formatDayLabel(input: string | number | Date): string {
  const date = toDate(input);
  if (!date) return "";

  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diffDays === 0) return "Hoje";
  if (diffDays === -1) return "Ontem";
  return dayFormatter.format(date);
}

/** "agora", "há 5 min", "há 2 h" — usado na lista de conversas. */
export function formatRelativeTime(input: string | number | Date): string {
  const date = toDate(input);
  if (!date) return "";

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 45) return "agora";
  if (absSeconds < 3600) return relativeFormatter.format(Math.round(diffSeconds / 60), "minute");
  if (absSeconds < 86_400) return relativeFormatter.format(Math.round(diffSeconds / 3600), "hour");
  if (absSeconds < 604_800) return relativeFormatter.format(Math.round(diffSeconds / 86_400), "day");
  return dayFormatter.format(date);
}

/** Chave de agrupamento por dia (YYYY-MM-DD) para divisores na thread. */
export function dayKey(input: string | number | Date): string {
  const date = toDate(input);
  return date ? date.toISOString().slice(0, 10) : "";
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
