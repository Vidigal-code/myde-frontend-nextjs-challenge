import type { Metadata, Viewport } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import "./globals.css";
import { Providers } from "./providers";
import { getQueryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/api/query-keys";
import { fetchConversations, fetchMe } from "@/shared/api/client";
import { AppShell } from "@/widgets/app-shell/ui/app-shell";

export const metadata: Metadata = {
  title: "Inbox de Atendimento — NeoFibra",
  description: "Painel de atendimento via WhatsApp com sugestões de IA.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Prefetch no servidor (sem waterfall no cliente). Erros não quebram a página:
  // prefetchQuery não lança — o cliente refaz a busca e exibe os estados de loading/erro.
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: queryKeys.me, queryFn: fetchMe }),
    queryClient.prefetchQuery({ queryKey: queryKeys.conversations, queryFn: fetchConversations }),
  ]);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <AppShell>{children}</AppShell>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
