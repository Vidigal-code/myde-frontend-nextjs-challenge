import { AlertCircle, Check, CheckCheck, Clock } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import type { ChatMessage } from "@/entities/message/model";

/** Ícone de status estilo WhatsApp para mensagens enviadas pelo atendente. */
export function MessageStatusIcon({ message }: { message: ChatMessage }) {
  if (message.failed) {
    return <AlertCircle className="size-3.5 text-destructive" aria-label="Falha no envio" />;
  }
  if (message.pending) {
    return <Clock className="size-3.5 text-muted-foreground" aria-label="Enviando" />;
  }
  if (message.status === "read") {
    return <CheckCheck className={cn("size-3.5 text-sky-500")} aria-label="Lida" />;
  }
  if (message.status === "delivered") {
    return <CheckCheck className="size-3.5 text-muted-foreground" aria-label="Entregue" />;
  }
  return <Check className="size-3.5 text-muted-foreground" aria-label="Enviada" />;
}
