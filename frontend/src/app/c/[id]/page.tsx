import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/api/query-keys";
import { fetchMessages } from "@/shared/api/client";
import { ChatPanel } from "@/widgets/chat/ui/chat-panel";

/** Rota do chat de uma conversa. Faz prefetch das mensagens no servidor. */
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.messages(id),
    queryFn: () => fetchMessages(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatPanel conversationId={id} />
    </HydrationBoundary>
  );
}
