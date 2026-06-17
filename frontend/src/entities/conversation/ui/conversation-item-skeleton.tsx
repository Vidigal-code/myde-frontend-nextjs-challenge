import { Skeleton } from "@/shared/ui/skeleton";

/** Placeholder de uma linha da lista durante o carregamento. */
export function ConversationItemSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <Skeleton className="size-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}
