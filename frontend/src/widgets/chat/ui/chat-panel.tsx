"use client";

import { MessagesSquare } from "lucide-react";

import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState, ErrorState } from "@/shared/ui/state-views";
import { toErrorMessage } from "@/shared/api/http-error";
import { selectConversationById, useConversations } from "@/entities/conversation/model";
import { type ChatMessage, useMessages } from "@/entities/message/model";
import { MessageThreadSkeleton } from "@/entities/message/ui/message-thread-skeleton";
import { MessageComposer } from "@/features/send-message/ui/message-composer";
import { ChatHeader } from "@/widgets/chat/ui/chat-header";
import { MessageThread } from "@/widgets/chat/ui/message-thread";

/** Painel de chat completo de uma conversa: cabeçalho + histórico + composição. */
export function ChatPanel({ conversationId }: { conversationId: string }) {
  const conversations = useConversations();
  const conversation = selectConversationById(conversations.data, conversationId);
  const messages = useMessages(conversationId);

  // Conversa inexistente (id inválido) — só após a lista ter carregado.
  if (conversations.isSuccess && !conversation) {
    return (
      <ErrorState
        title="Conversa não encontrada"
        message="Ela pode ter sido removida. Volte e escolha outra conversa."
      />
    );
  }

  return (
    <div className="flex h-full flex-col bg-muted/30">
      {conversation ? <ChatHeader conversation={conversation} /> : <ChatHeaderSkeleton />}

      <ChatBody
        isLoading={messages.isLoading}
        isError={messages.isError}
        errorMessage={messages.isError ? toErrorMessage(messages.error) : ""}
        onRetry={messages.refetch}
        messages={messages.data ?? []}
      />

      <MessageComposer conversationId={conversationId} />
    </div>
  );
}

function ChatBody({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  messages,
}: {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  messages: ChatMessage[];
}) {
  if (isLoading) return <MessageThreadSkeleton />;
  if (isError) return <ErrorState message={errorMessage} onRetry={onRetry} />;
  if (!messages || messages.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="Nenhuma mensagem ainda"
        description="Envie a primeira mensagem ou use a sugestão de IA para começar."
      />
    );
  }
  return <MessageThread messages={messages} />;
}

function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b bg-background px-3 py-2.5">
      <Skeleton className="size-10 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
