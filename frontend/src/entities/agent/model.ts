import { useQuery } from "@tanstack/react-query";

import { fetchMe } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { Agent } from "@/shared/api/types";

export type { Agent };

/** Perfil do atendente logado. Raramente muda — sem polling. */
export function useAgent() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    staleTime: Infinity,
  });
}
