import { Badge } from "@/shared/ui/badge";

/** Indicador de mensagens não-lidas. Não renderiza nada quando `count` é zero. */
export function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <Badge
      variant="success"
      className="h-5 min-w-5 justify-center px-1.5 tabular-nums"
      aria-label={`${count} ${count === 1 ? "mensagem não lida" : "mensagens não lidas"}`}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
