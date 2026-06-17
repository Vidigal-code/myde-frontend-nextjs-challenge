/** Divisor de dia ("Hoje", "Ontem", data) entre grupos de mensagens. */
export function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
