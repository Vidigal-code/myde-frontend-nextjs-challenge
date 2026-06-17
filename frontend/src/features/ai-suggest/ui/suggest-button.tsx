"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

/** Botão "Sugerir resposta com IA" (apresentacional; a lógica vem do useAiSuggest). */
export function SuggestButton({
  onClick,
  loading,
  disabled,
}: {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onClick}
          disabled={disabled || loading}
          aria-label="Sugerir resposta com IA"
        >
          {loading ? <Spinner label="Gerando sugestão" /> : <Sparkles className="size-5" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Sugerir resposta com IA</TooltipContent>
    </Tooltip>
  );
}
