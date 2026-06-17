"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import { requestAiSuggestion } from "@/shared/api/client";
import { toErrorMessage } from "@/shared/api/http-error";
import { AI_TYPING_STEP_MS } from "@/shared/config/constants";
import type { AiSuggestionSource } from "@/shared/api/types";

/** Quantos caracteres revelar por tick do efeito de digitação. */
const CHARS_PER_STEP = 2;

interface UseAiSuggestOptions {
  /** Escreve o texto (parcial e final) no campo de mensagem. */
  onText: (text: string) => void;
}

/**
 * Busca a sugestão da IA (`/ai/suggest`) e a "digita" no campo de mensagem.
 * A chave da OpenAI nunca toca o browser — o backend faz o proxy server-side.
 */
export function useAiSuggest(conversationId: string, { onText }: UseAiSuggestOptions) {
  const [isTyping, setIsTyping] = React.useState(false);
  const [source, setSource] = React.useState<AiSuggestionSource | null>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTyping = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsTyping(false);
  }, []);

  React.useEffect(() => stopTyping, [stopTyping]);

  const revealText = React.useCallback(
    (full: string) => {
      stopTyping();
      setIsTyping(true);
      let index = 0;
      intervalRef.current = setInterval(() => {
        index = Math.min(index + CHARS_PER_STEP, full.length);
        onText(full.slice(0, index));
        if (index >= full.length) stopTyping();
      }, AI_TYPING_STEP_MS);
    },
    [onText, stopTyping],
  );

  const mutation = useMutation({
    mutationFn: () => requestAiSuggestion(conversationId),
    onSuccess: (data) => {
      setSource(data.source);
      revealText(data.suggestion);
    },
  });

  return {
    suggest: () => mutation.mutate(),
    isLoading: mutation.isPending,
    isTyping,
    source,
    error: mutation.isError ? toErrorMessage(mutation.error) : null,
    reset: () => {
      stopTyping();
      setSource(null);
      mutation.reset();
    },
  };
}
