import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Skeleton } from "@/shared/ui/skeleton";
import { getInitials } from "@/shared/lib/get-initials";
import type { Agent } from "@/entities/agent/model";

/** Identidade do atendente (avatar + nome + função). Reutilizada no header e no menu. */
export function AgentIdentity({ agent, compact = false }: { agent: Agent; compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className={compact ? "size-9" : "size-10"}>
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(agent.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{agent.name}</p>
        <p className="truncate text-xs text-muted-foreground">{agent.role}</p>
      </div>
    </div>
  );
}

export function AgentIdentitySkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
