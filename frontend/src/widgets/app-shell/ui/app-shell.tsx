"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { ConversationList } from "@/widgets/conversation-list/ui/conversation-list";
import { AgentSection } from "@/widgets/app-shell/ui/agent-section";
import { MobileNav } from "@/widgets/app-shell/ui/mobile-nav";

/**
 * Layout responsivo master-detail:
 * - Mobile: uma coluna por vez (lista em `/`, chat em `/c/[id]`); menu no hambúrguer.
 * - Desktop (lg+): duas colunas fixas (lista + detalhe) sempre visíveis.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatOpen = pathname.startsWith("/c/");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden lg:flex-row">
      {/* Coluna da lista */}
      <aside
        className={cn(
          "flex w-full flex-col overflow-hidden lg:w-[clamp(300px,32vw,400px)] lg:shrink-0 lg:border-r",
          isChatOpen && "hidden lg:flex",
        )}
      >
        {/* Header desktop: perfil + tema */}
        <div className="hidden items-center justify-between gap-2 border-b px-3 py-2 lg:flex">
          <AgentSection compact />
          <ThemeToggle />
        </div>

        {/* Header mobile: hambúrguer + título + tema */}
        <div className="flex items-center justify-between gap-2 border-b px-2 py-2 lg:hidden">
          <MobileNav />
          <h1 className="text-base font-semibold">Conversas</h1>
          <ThemeToggle />
        </div>

        <div className="min-h-0 flex-1">
          <ConversationList />
        </div>
      </aside>

      {/* Coluna do detalhe (chat ou placeholder) */}
      <main
        className={cn(
          "min-w-0 flex-1 flex-col overflow-hidden",
          isChatOpen ? "flex" : "hidden lg:flex",
        )}
      >
        {children}
      </main>
    </div>
  );
}
