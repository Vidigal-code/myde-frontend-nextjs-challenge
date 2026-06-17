import { dayKey } from "@/shared/lib/format-time";
import type { ChatMessage } from "@/entities/message/model";

export interface MessageDayGroup {
  key: string;
  messages: ChatMessage[];
}

/** Agrupa mensagens consecutivas por dia, preservando a ordem cronológica. */
export function groupMessagesByDay(messages: ChatMessage[]): MessageDayGroup[] {
  const groups: MessageDayGroup[] = [];

  for (const message of messages) {
    const key = dayKey(message.createdAt);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.key === key) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ key, messages: [message] });
    }
  }

  return groups;
}
