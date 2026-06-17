"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Inbox, MessageSquareOff, SearchX } from "lucide-react";

import { ScrollArea } from "@/shared/ui/scroll-area";
import { EmptyState, ErrorState } from "@/shared/ui/state-views";
import { toErrorMessage } from "@/shared/api/http-error";
import { useConversations } from "@/entities/conversation/model";
import { ConversationItem } from "@/entities/conversation/ui/conversation-item";
import { ConversationItemSkeleton } from "@/entities/conversation/ui/conversation-item-skeleton";
import { SearchInput } from "@/features/search-conversations/ui/search-input";
import { filterConversations, useSearchStore } from "@/features/search-conversations/model";

/** Lista de conversas: busca + itens navegáveis + estados (loading/erro/vazio). */
export function ConversationList() {
  const { data, isLoading, isError, error, refetch } = useConversations();
  const term = useSearchStore((state) => state.term);
  const params = useParams<{ id?: string }>();
  const activeId = params?.id;

  const filtered = React.useMemo(
    () => filterConversations(data ?? [], term),
    [data, term],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <SearchInput />
      </div>

      <ScrollArea className="flex-1" viewportClassName="[&>div]:!block">
        <ConversationListBody
          isLoading={isLoading}
          isError={isError}
          errorMessage={isError ? toErrorMessage(error) : ""}
          onRetry={refetch}
          total={data?.length ?? 0}
          items={filtered}
          activeId={activeId}
          hasSearch={term.trim().length > 0}
        />
      </ScrollArea>
    </div>
  );
}

function ConversationListBody({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  total,
  items,
  activeId,
  hasSearch,
}: {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  total: number;
  items: ReturnType<typeof filterConversations>;
  activeId?: string;
  hasSearch: boolean;
}) {
  if (isLoading) {
    return (
      <ul aria-busy="true" aria-label="Carregando conversas">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index}>
            <ConversationItemSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (total === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nenhuma conversa por aqui"
        description="Quando um cliente enviar uma mensagem, ela aparecerá nesta lista."
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={hasSearch ? SearchX : MessageSquareOff}
        title="Nenhum resultado"
        description="Tente buscar por outro nome, telefone ou trecho de mensagem."
      />
    );
  }

  return (
    <ul role="list" className="divide-y">
      {items.map((conversation) => (
        <li key={conversation.id}>
          <Link
            href={`/c/${conversation.id}`}
            aria-current={conversation.id === activeId ? "page" : undefined}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <ConversationItem conversation={conversation} active={conversation.id === activeId} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
