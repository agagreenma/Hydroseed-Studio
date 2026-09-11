import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, LayoutTemplate, Newspaper, BookOpen, FileText,
  GraduationCap, Sparkles, Mail, Search, LineChart,
  Image as ImageIcon, ArrowRightLeft, Tags, Users, Settings, ChevronsLeft, Blocks, Library,
  ChevronsRight, Command, Plus, Bell, Menu, X, Plug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StudioLogo } from "./Logo";

type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean; badge?: number; soon?: boolean };
type NavGroup = { group: string; items: NavItem[] };

/**
 * HYDROSEED Studio navigation.
 *
 * Active modules are the current scope. Items flagged `soon` keep their route and
 * architecture but are future functionality — they must never look production-ready.
 */
const NAV: NavGroup[] = [
  {
    group: "Workspace",
    items: [
      { to: "/", label: "Overview", icon: LayoutDashboard, exact: true },
      { to: "/architecture", label: "Architecture", icon: Blocks },
    ],
  },
  {
    group: "Publishing",
    items: [
      { to: "/content", label: "Content", icon: Library },
      { to: "/landing", label: "Landing Pages", icon: LayoutTemplate },
      { to: "/blog", label: "Blog", icon: Newspaper, badge: 3 },
      { to: "/resources", label: "Resources", icon: BookOpen },
      { to: "/case-studies", label: "Case Studies", icon: Sparkles },
      { to: "/docs", label: "Documentation", icon: FileText, soon: true },
      { to: "/academy", label: "Academy", icon: GraduationCap, soon: true },
      { to: "/newsletter", label: "Newsletter", icon: Mail, soon: true },
    ],
  },
  {
    group: "Growth",
    items: [
      { to: "/seo", label: "SEO", icon: Search, badge: 12 },
      { to: "/analytics", label: "Analytics", icon: LineChart },
      { to: "/media", label: "Media Library", icon: ImageIcon },
      { to: "/integrations", label: "Integrations", icon: Plug, soon: true },
      { to: "/redirects", label: "Redirects", icon: ArrowRightLeft, soon: true },
      { to: "/taxonomy", label: "Taxonomy", icon: Tags, soon: true },
    ],
  },
  {
    group: "System",
    items: [
      { to: "/team", label: "Team", icon: Users },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function isActive(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to;
  return pathname === to || pathname.startsWith(to + "/");
}

function SidebarInner({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
      {NAV.map((g) => (
        <div key={g.group}>
          {!collapsed ? (
            <div className="px-2.5 mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {g.group}
            </div>
          ) : (
            <div className="mx-2 mb-1.5 h-px bg-sidebar-border/60" />
          )}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = isActive(pathname, item.to, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={`group flex items-center ${collapsed ? "justify-center px-0" : "gap-2.5 px-2.5"} py-2 rounded-md text-sm transition ${
                      active
                        ? "bg-sidebar-accent text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.soon ? (
                          <span className="ml-auto rounded-full border border-border bg-muted px-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                            Soon
                          </span>
                        ) : item.badge ? (
                          <span className="ml-auto rounded-full bg-primary-soft px-1.5 text-[10px] font-medium text-primary">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  return (
    <aside
      className={`hidden lg:flex ${collapsed ? "lg:w-16" : "lg:w-64"} shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200`}
    >
      <div className={`flex h-14 items-center border-b border-sidebar-border ${collapsed ? "justify-center px-2" : "px-4"}`}>
        <StudioLogo iconOnly={collapsed} />
      </div>
      <SidebarInner collapsed={collapsed} />
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex w-full items-center ${collapsed ? "justify-center" : "gap-2 px-2.5"} py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60`}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : (<><ChevronsLeft className="h-4 w-4" /> Collapse</>)}
        </button>
      </div>
    </aside>
  );
}

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`lg:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-foreground/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <StudioLogo />
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-sidebar-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <SidebarInner collapsed={false} onNavigate={onClose} />
      </aside>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-3 sm:px-5 backdrop-blur">
      <button onClick={onMenu} className="lg:hidden p-1.5 rounded-md hover:bg-sidebar-accent">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search content, pages, media…"
            className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-16 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring/60"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-3 w-3" /> K
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 h-9 text-sm hover:bg-muted">
          <Plus className="h-4 w-4" /> Create
        </button>
        <button className="p-2 rounded-md hover:bg-muted relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/90 text-primary-foreground grid place-items-center text-xs font-medium">
          AF
        </div>
      </div>
    </header>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
