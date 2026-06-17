"use client";

import * as React from "react";

/**
 * Mantém um container rolado até o fim quando uma dependência muda (ex.: nova mensagem),
 * **respeitando** o usuário: se ele rolou para cima para ler o histórico, não força o scroll.
 */
export function useAutoScroll<T extends HTMLElement>(dependency: unknown) {
  const ref = React.useRef<T>(null);
  const pinnedToBottom = React.useRef(true);

  const handleScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    pinnedToBottom.current = distanceFromBottom < 80;
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (el && pinnedToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [dependency]);

  return { ref, handleScroll };
}
