import { cn } from "@/shared/lib/cn";

/** Placeholder animado para estados de carregamento. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
