"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { Input } from "@/shared/ui/input";
import { useSearchStore } from "@/features/search-conversations/model";

/** Campo de busca da lista de conversas, ligado ao store de busca. */
export function SearchInput({ className }: { className?: string }) {
  const term = useSearchStore((state) => state.term);
  const setTerm = useSearchStore((state) => state.setTerm);
  const clear = useSearchStore((state) => state.clear);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        role="searchbox"
        aria-label="Buscar conversas"
        placeholder="Buscar por nome, telefone ou mensagem"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        className="pl-9 pr-9"
      />
      {term ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpar busca"
          className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
