"use client";

import { Menu } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { useUiStore } from "@/shared/store/ui-store";
import { AgentSection } from "@/widgets/app-shell/ui/agent-section";

/** Menu lateral (hambúrguer) do mobile: perfil do atendente + tema. */
export function MobileNav() {
  const isOpen = useUiStore((state) => state.isNavOpen);
  const setOpen = useUiStore((state) => state.setNavOpen);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Abrir menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 max-w-[85vw] flex-col gap-0">
        <SheetHeader>
          <SheetTitle>Inbox de Atendimento</SheetTitle>
          <SheetDescription>Painel de atendimento via WhatsApp</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="p-4">
          <AgentSection />
        </div>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <span className="text-sm text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
