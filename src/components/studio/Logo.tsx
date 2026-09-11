type Props = { iconOnly?: boolean; className?: string };

export function StudioLogo({ iconOnly, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      <div
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
        style={{ background: "linear-gradient(135deg, #1f4a37 0%, #3f8f6b 100%)" }}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          {/* Water droplet over a sprouting shoot — hydroseeding mark */}
          <path d="M10 2.5 C12.6 5.6 14.2 7.7 14.2 9.7 a4.2 4.2 0 0 1-8.4 0 C5.8 7.7 7.4 5.6 10 2.5 Z" fill="white" />
          <path d="M10 17.5 L10 12.4 M10 14.2 C8.4 14.2 7.2 13.2 7.1 11.7 c1.7-0.1 2.9 0.8 2.9 2.5 Z M10 13.2 c1.5 0 2.7-1 2.8-2.4 -1.6-0.1-2.8 0.8-2.8 2.4 Z" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!iconOnly && (
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-display text-[19px] leading-none tracking-[-0.035em] text-foreground">
            HYDROSEED
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Studio
          </span>
        </div>
      )}
    </div>
  );
}
