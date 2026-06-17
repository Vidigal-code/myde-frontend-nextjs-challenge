"use client";

import { create } from "zustand";

/** Estado de UI puramente do cliente (não confundir com server state do React Query). */
interface UiState {
  /** Controla o menu lateral (hambúrguer) no mobile. */
  isNavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  setNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isNavOpen: false,
  openNav: () => set({ isNavOpen: true }),
  closeNav: () => set({ isNavOpen: false }),
  setNavOpen: (open) => set({ isNavOpen: open }),
}));
