import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/cn";

/** Indicador de carregamento acessível e reutilizável. */
export function Spinner({ className, label = "Carregando" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-live="polite">
      <Loader2 className={cn("size-4 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
