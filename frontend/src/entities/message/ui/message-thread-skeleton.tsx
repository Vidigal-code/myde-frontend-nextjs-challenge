import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/cn";

const WIDTHS = ["w-40", "w-56", "w-32", "w-48", "w-60"] as const;

/** Placeholder da thread de mensagens durante o carregamento. */
export function MessageThreadSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {WIDTHS.map((width, index) => (
        <div key={index} className={cn("flex", index % 2 === 0 ? "justify-start" : "justify-end")}>
          <Skeleton className={cn("h-10 rounded-2xl", width)} />
        </div>
      ))}
    </div>
  );
}
