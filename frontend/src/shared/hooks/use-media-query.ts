"use client";

import * as React from "react";

import { DESKTOP_MIN_WIDTH } from "@/shared/config/constants";

/** Assina uma media query e retorna se ela bate. SSR-safe (assume `false` no servidor). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Conveniência: true a partir do breakpoint de desktop (layout de duas colunas). */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
}
