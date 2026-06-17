import { cn } from "@/shared/lib/cn";
import { formatRelativeTime } from "@/shared/lib/format-time";
import { ContactAvatar } from "@/entities/conversation/ui/contact-avatar";
import { UnreadBadge } from "@/entities/conversation/ui/unread-badge";
import type { Conversation } from "@/entities/conversation/model";

/**
 * Linha da lista de conversas (apresentacional). O roteamento/estado-ativo é
 * responsabilidade do widget que a envolve com um <Link>.
 */
export function ConversationItem({
  conversation,
  active = false,
}: {
  conversation: Conversation;
  active?: boolean;
}) {
  const { contactName, avatarColor, lastMessage, lastMessageAt, unread } = conversation;
  const hasUnread = unread > 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-3 transition-colors",
        active ? "bg-accent" : "hover:bg-accent/60",
      )}
    >
      <ContactAvatar name={contactName} color={avatarColor} className="size-11" />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{contactName}</p>
          <time
            dateTime={lastMessageAt}
            className="shrink-0 text-xs text-muted-foreground"
            title={new Date(lastMessageAt).toLocaleString("pt-BR")}
          >
            {formatRelativeTime(lastMessageAt)}
          </time>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              hasUnread ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {lastMessage}
          </p>
          <UnreadBadge count={unread} />
        </div>
      </div>
    </div>
  );
}
