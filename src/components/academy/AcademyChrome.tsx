import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Menu, Search, X } from "lucide-react";

const NAV = [
  { label: "Catalogue", hash: "#catalogue" },
  { label: "Paths", hash: "#paths" },
  { label: "Certification", hash: "#certification" },
  { label: "Faculty", hash: "#faculty" },
];

export function AcademyHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-5 lg:px-8">
        <Link to="/learn" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-display text-lg tracking-tight">
            HYDROSEED <span className="text-muted-foreground">Academy</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV.map((n) => (
            <a key={n.label} href={n.hash} className="text-muted-foreground hover:text-foreground transition">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search courses"
              className="h-9 w-56 rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <a href="#signin" className="hidden sm:inline-flex h-9 items-center px-3 text-sm text-muted-foreground hover:text-foreground">
            Sign in
          </a>
          <a href="#enrol" className="hidden sm:inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground hover:opacity-95">
            Start learning
          </a>
          <button onClick={() => setOpen((v) => !v)} className="md:hidden p-2 rounded-md hover:bg-muted" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-[1280px] px-5 py-4 flex flex-col gap-3 text-sm">
            {NAV.map((n) => (
              <a key={n.label} href={n.hash} onClick={() => setOpen(false)} className="py-1 text-muted-foreground">
                {n.label}
              </a>
            ))}
            <a href="#enrol" className="h-9 grid place-items-center rounded-md bg-primary text-sm text-primary-foreground">
              Start learning
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export function AcademyFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">HYDROSEED Academy</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Professional education for people running revegetation crews — built by the team behind the HYDROSEED
            operating system.
          </p>
        </div>
        <div>
          <div className="mono-label mb-3">Learn</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#catalogue" className="hover:text-foreground">Catalogue</a></li>
            <li><a href="#paths" className="hover:text-foreground">Learning paths</a></li>
            <li><a href="#certification" className="hover:text-foreground">Certification</a></li>
          </ul>
        </div>
        <div>
          <div className="mono-label mb-3">HYDROSEED</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/journal" className="hover:text-foreground">Journal</Link></li>
            <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
            <li><a href="#privacy" className="hover:text-foreground">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} HYDROSEED. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
