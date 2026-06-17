import { MessagesSquare } from "lucide-react";

import { EmptyState } from "@/shared/ui/state-views";

/**
 * Rota inicial (`/`). No desktop, ocupa a coluna de detalhe com um placeholder.
 * No mobile, esta coluna fica oculta e o usuário vê a lista de conversas (ver AppShell).
 */
export default function HomePage() {
  return (
    <EmptyState
      icon={MessagesSquare}
      title="Selecione uma conversa"
      description="Escolha um contato à esquerda para ver o histórico e responder."
    />
  );
}
