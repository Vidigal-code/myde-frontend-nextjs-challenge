"use client";

import { useAgent } from "@/entities/agent/model";
import { AgentIdentity, AgentIdentitySkeleton } from "@/entities/agent/ui/agent-identity";

/** Mostra a identidade do atendente logado (com fallback de carregamento). */
export function AgentSection({ compact = false }: { compact?: boolean }) {
  const { data: agent, isLoading } = useAgent();

  if (isLoading || !agent) return <AgentIdentitySkeleton />;
  return <AgentIdentity agent={agent} compact={compact} />;
}
