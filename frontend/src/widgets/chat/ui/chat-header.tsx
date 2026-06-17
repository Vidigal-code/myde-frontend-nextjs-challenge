import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { ContactAvatar } from "@/entities/conversation/ui/contact-avatar";
import type { Conversation } from "@/entities/conversation/model";

/** Formata "5511988887766" como "+55 11 98888-7766". */
function formatPhone(phone: string): string {
  const match = phone.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/);
  if (!match) return phone;
  const [, country, area, prefix, suffix] = match;
  return `+${country} ${area} ${prefix}-${suffix}`;
}

/** Cabeçalho do chat: voltar (mobile) + identidade do contato. */
export function ChatHeader({ conversation }: { conversation: Conversation }) {
  return (
    <header className="flex items-center gap-3 border-b bg-background px-3 py-2.5">
      <Button asChild variant="ghost" size="icon-sm" className="lg:hidden">
        <Link href="/" aria-label="Voltar para a lista de conversas">
          <ArrowLeft className="size-5" />
        </Link>
      </Button>

      <ContactAvatar
        name={conversation.contactName}
        color={conversation.avatarColor}
        className="size-10"
      />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {conversation.contactName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {formatPhone(conversation.contactPhone)}
        </p>
      </div>
    </header>
  );
}
