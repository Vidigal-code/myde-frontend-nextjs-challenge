import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { getInitials } from "@/shared/lib/get-initials";

/** Avatar do contato com cor de fundo vinda da API (`avatarColor`). */
export function ContactAvatar({
  name,
  color,
  className,
}: {
  name: string;
  color: string;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarFallback style={{ backgroundColor: color }} className="text-white">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
