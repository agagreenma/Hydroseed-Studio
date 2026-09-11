import { Info } from "lucide-react";

/**
 * Sample-data indicator.
 *
 * Every screen in HYDROSEED Studio currently renders hard-coded sample data.
 * This component makes that explicit so nothing on screen can be mistaken for
 * a live database, analytics provider or publishing backend.
 */
export function SampleDataBadge({ label = "Sample data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      <Info className="h-3 w-3" />
      {label}
    </span>
  );
}

export function SampleDataNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        {children ??
          "This screen shows sample data. HYDROSEED Studio is not yet connected to a content database, analytics provider or publishing backend."}
      </p>
    </div>
  );
}
