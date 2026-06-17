"use client";

import * as React from "react";

import { formatDayLabel } from "@/shared/lib/format-time";
import { useAutoScroll } from "@/shared/hooks/use-auto-scroll";
import { MessageBubble } from "@/entities/message/ui/message-bubble";
import { DayDivider } from "@/entities/message/ui/day-divider";
import { groupMessagesByDay } from "@/entities/message/lib/group-by-day";
import type { ChatMessage } from "@/entities/message/model";

/** Histórico rolável de mensagens, agrupado por dia e com auto-scroll ao fim. */
export function MessageThread({ messages }: { messages: ChatMessage[] }) {
  const { ref, handleScroll } = useAutoScroll<HTMLDivElement>(messages.length);
  const groups = React.useMemo(() => groupMessagesByDay(messages), [messages]);

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-label="Histórico de mensagens"
      className="flex-1 space-y-1 overflow-y-auto px-3 py-4 sm:px-4"
    >
      {groups.map((group) => (
        <section key={group.key} className="space-y-1.5">
          <DayDivider label={formatDayLabel(group.messages[0].createdAt)} />
          {group.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </section>
      ))}
    </div>
  );
}
