export function NewsletterCTA({ eyebrow = "The HYDROSEED Weekly", title = "Operational intelligence for modern revegetation crews — in your inbox every Wednesday.", note = "No spam. Unsubscribe in one click." }: { eyebrow?: string; title?: string; note?: string }) {
  return (
    <section className="border-y border-border bg-primary-soft">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <div className="mono-label mb-2 text-accent-foreground">{eyebrow}</div>
          <h2 className="font-display text-2xl md:text-3xl leading-tight text-foreground">{title}</h2>
        </div>
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="flex-1 h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <button className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-95">
            Subscribe
          </button>
          <div className="sm:absolute sm:-bottom-6 text-xs text-muted-foreground">{note}</div>
        </form>
      </div>
    </section>
  );
}

export function HydroseedCTA({ title = "Run your crew on HYDROSEED.", body = "Project planning, materials, bids and intelligence — connected in one workspace built for hydroseeding and erosion control.", primary = "Start free trial", secondary = "Talk to sales" }: { title?: string; body?: string; primary?: string; secondary?: string }) {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 md:py-20 grid gap-8 md:grid-cols-[1.4fr_1fr] items-center">
        <div>
          <div className="mono-label mb-3 text-background/60">HYDROSEED OS</div>
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight">{title}</h2>
          <p className="mt-4 max-w-xl text-background/70 leading-relaxed">{body}</p>
        </div>
        <div className="flex flex-col sm:flex-row md:justify-end gap-3">
          <a href="#trial" className="h-11 grid place-items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">{primary}</a>
          <a href="#sales" className="h-11 grid place-items-center rounded-md border border-background/30 px-5 text-sm text-background hover:bg-background/10">{secondary}</a>
        </div>
      </div>
    </section>
  );
}
