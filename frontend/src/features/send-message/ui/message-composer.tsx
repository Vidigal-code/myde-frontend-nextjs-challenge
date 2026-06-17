"use client";

import * as React from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/cn";
import { useDraft, useDraftStore } from "@/features/send-message/draft-store";
import { toErrorMessage, useSendMessage } from "@/features/send-message/use-send-message";
import { useAiSuggest } from "@/features/ai-suggest/use-ai-suggest";
import { SuggestButton } from "@/features/ai-suggest/ui/suggest-button";
import { AiSourceBadge } from "@/features/ai-suggest/ui/source-badge";

/** Caixa de composição: rascunho persistente, envio otimista e sugestão de IA. */
export function MessageComposer({ conversationId }: { conversationId: string }) {
  const draft = useDraft(conversationId);
  const setDraft = useDraftStore((state) => state.setDraft);
  const clearDraft = useDraftStore((state) => state.clearDraft);

  const sendMessage = useSendMessage(conversationId);
  const ai = useAiSuggest(conversationId, {
    onText: (text) => setDraft(conversationId, text),
  });

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && !ai.isTyping;

  const handleSubmit = React.useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      if (!canSend) return;
      sendMessage.mutate(trimmed);
      clearDraft(conversationId);
      ai.reset();
    },
    [canSend, trimmed, sendMessage, clearDraft, conversationId, ai],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter envia; Shift+Enter quebra linha.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-background p-3">
      {ai.source ? (
        <div className="mb-2 flex justify-center">
          <AiSourceBadge source={ai.source} />
        </div>
      ) : null}

      {sendMessage.isError ? (
        <p role="alert" className="mb-2 text-center text-xs text-destructive">
          {toErrorMessage(sendMessage.error)} — toque em enviar para tentar de novo.
        </p>
      ) : null}
      {ai.error ? (
        <p role="alert" className="mb-2 text-center text-xs text-destructive">
          Não foi possível gerar a sugestão: {ai.error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <SuggestButton onClick={ai.suggest} loading={ai.isLoading} disabled={ai.isTyping} />

        <Textarea
          aria-label="Escreva uma mensagem"
          placeholder="Escreva uma mensagem"
          rows={1}
          value={draft}
          onChange={(event) => setDraft(conversationId, event.target.value)}
          onKeyDown={handleKeyDown}
          className={cn("max-h-32 min-h-10 flex-1 py-2.5", ai.isTyping && "text-muted-foreground")}
        />

        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          aria-label="Enviar mensagem"
          className="shrink-0"
        >
          <SendHorizonal className="size-5" />
        </Button>
      </form>
    </div>
  );
}
