import { Sparkles } from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import type { AiSuggestionSource } from "@/shared/api/types";

const LABELS: Record<AiSuggestionSource, string> = {
  openai: "Gerado por IA (OpenAI)",
  mock: "Sugestão heurística",
  "mock-fallback": "Sugestão heurística (fallback)",
};

/** Mostra a origem da sugestão preenchida pela IA. */
export function AiSourceBadge({ source }: { source: AiSuggestionSource }) {
  return (
    <Badge variant="secondary" className="gap-1">
      <Sparkles className="size-3" aria-hidden="true" />
      {LABELS[source]}
    </Badge>
  );
}
