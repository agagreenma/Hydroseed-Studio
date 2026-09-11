import { Link } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";

const GROUPS: { title: string; links: { label: string; href?: string; to?: "/journal" }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Operations", href: "#operations" },
      { label: "Commerce", href: "#commerce" },
      { label: "Intelligence", href: "#intelligence" },
      { label: "Marketplace", href: "#marketplace" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Articles", href: "/journal/articles" },
      { label: "Resources", href: "/journal/resources" },
      { label: "Academy", href: "/learn" },
      { label: "Case Studies", href: "/journal/case-studies" },
    ],
  },

  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Careers", href: "#careers" },
      { label: "Partners", href: "#partners" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Cookies", href: "#cookies" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg">
              <span className="inline-block h-6 w-6 rounded-sm bg-primary" />
              <span className="font-medium">HYDROSEED</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              The operating system for modern hydroseeding and revegetation crews. Project planning, content and
              growth — connected.
            </p>
          </div>
          {GROUPS.map((g) => (
            <div key={g.title}>
              <div className="mono-label mb-3">{g.title}</div>
              <ul className="space-y-2 text-sm">
                {g.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className="text-muted-foreground hover:text-foreground">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="text-muted-foreground hover:text-foreground">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} HYDROSEED Technologies. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Globe2 className="h-3.5 w-3.5" /> English
            </button>
            <a href="#twitter" className="hover:text-foreground">Twitter</a>
            <a href="#linkedin" className="hover:text-foreground">LinkedIn</a>
            <a href="#youtube" className="hover:text-foreground">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
