import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV: { label: string; to?: "/journal"; href?: string }[] = [
  { label: "Journal", to: "/journal" as const },
  { label: "Resources", href: "/journal/resources" },
  { label: "Academy", href: "/learn" },
  { label: "Case Studies", href: "/journal/case-studies" },
  { label: "Pricing", href: "#pricing" },
];


export function PublicHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const activeBlog = pathname === "/journal" || pathname.startsWith("/journal/");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 lg:px-8">
        <Link to="/journal" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="inline-block h-6 w-6 rounded-sm bg-primary" />
          <span className="font-medium">HYDROSEED</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV.map((n) =>
            n.to ? (
              <Link
                key={n.label}
                to={n.to}
                className={`transition ${activeBlog ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
              </Link>
            ) : (
              <a
                key={n.label}
                href={n.href}
                className="text-muted-foreground hover:text-foreground transition"
              >
                {n.label}
              </a>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a href="#signin" className="hidden sm:inline-flex h-9 items-center px-3 text-sm text-muted-foreground hover:text-foreground">
            Sign in
          </a>
          <a
            href="#trial"
            className="hidden sm:inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground hover:opacity-95"
          >
            Start free trial
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-md hover:bg-muted"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-5 py-4 flex flex-col gap-3 text-sm">
            {NAV.map((n) =>
              n.to ? (
                <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="py-1">
                  {n.label}
                </Link>
              ) : (
                <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-1 text-muted-foreground">
                  {n.label}
                </a>
              ),
            )}
            <div className="flex gap-2 pt-2 border-t border-border">
              <a href="#signin" className="flex-1 h-9 grid place-items-center rounded-md border border-border text-sm">Sign in</a>
              <a href="#trial" className="flex-1 h-9 grid place-items-center rounded-md bg-primary text-sm text-primary-foreground">Start free trial</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
