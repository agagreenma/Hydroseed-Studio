import type { Status } from "@/lib/mock";
import { statusLabel } from "@/lib/mock";

const styles: Record<Status, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  in_review: "bg-warn/15 text-warn-foreground border-warn/25",
  approved: "bg-info/10 text-info border-info/20",
  scheduled: "bg-primary-soft text-primary border-primary/20",
  published: "bg-success/10 text-success border-success/20",
  archived: "bg-muted text-muted-foreground border-border opacity-70",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {statusLabel(status)}
    </span>
  );
}

export function SeoDot({ state }: { state: "ok" | "warn" | "issue" }) {
  const cls =
    state === "ok" ? "bg-success" : state === "warn" ? "bg-warn" : "bg-destructive";
  const label = state === "ok" ? "Healthy" : state === "warn" ? "Needs attention" : "Issues";
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${cls}`} />
      {label}
    </span>
  );
}

export function LangChip({ code }: { code: string }) {
  return <span className="chip uppercase font-mono">{code}</span>;
}
