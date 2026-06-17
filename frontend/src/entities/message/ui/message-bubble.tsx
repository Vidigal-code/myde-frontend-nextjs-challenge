import { cn } from "@/shared/lib/cn";
import { formatTime } from "@/shared/lib/format-time";
import { MessageStatusIcon } from "@/entities/message/ui/message-status-icon";
import type { ChatMessage } from "@/entities/message/model";

/** Bolha de mensagem. `out` (atendente) alinha à direita; `in` (cliente) à esquerda. */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const isOutgoing = message.direction === "out";

  return (
    <div className={cn("flex w-full", isOutgoing ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm sm:max-w-[70%]",
          isOutgoing
            ? "rounded-br-sm bg-bubble-out text-bubble-out-foreground"
            : "rounded-bl-sm bg-card text-card-foreground",
          message.pending && "opacity-70",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        <div
          className={cn(
            "mt-1 flex items-center gap-1",
            isOutgoing ? "justify-end" : "justify-start",
          )}
        >
          <time dateTime={message.createdAt} className="text-[11px] text-muted-foreground">
            {formatTime(message.createdAt)}
          </time>
          {isOutgoing ? <MessageStatusIcon message={message} /> : null}
        </div>
      </div>
    </div>
  );
}
