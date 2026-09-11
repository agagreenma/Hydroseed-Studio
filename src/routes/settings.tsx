import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StudioLogo } from "@/components/studio/Logo";
import { useState } from "react";
import { LANGS } from "@/lib/mock";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · HYDROSEED Studio" },
      { name: "description", content: "Workspace, brand and publishing defaults for hydroseed.app." },
    ],
  }),
  component: SettingsPage,
});

const SECTIONS = [
  "General",
  "Branding",
  "Domains",
  "Languages",
  "Publishing",
  "SEO defaults",
  "Social defaults",
  "Schema defaults",
  "Integrations",
  "Notifications",
];

function SettingsPage() {
  const [section, setSection] = useState("General");
  return (
    <>
      <PageHeader eyebrow="System · Settings" title="Workspace settings" description="Studio configuration, brand defaults and integrations for hydroseed.app." />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="surface-card p-2">
            <ul className="space-y-0.5">
              {SECTIONS.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => setSection(s)}
                    className={`w-full text-left rounded-md px-2.5 py-1.5 text-sm ${
                      section === s ? "bg-primary-soft text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="space-y-4">
            {section === "General" && (
              <div className="surface-card p-5 space-y-4">
                <Row label="Workspace name" value="HYDROSEED Studio" />
                <Row label="Studio URL" value="https://studio.hydroseed.app" mono />
                <Row label="Public site" value="https://hydroseed.app" mono />
                <Row label="Timezone" value="Europe/Paris" />
              </div>
            )}
            {section === "Branding" && (
              <div className="surface-card p-5 space-y-5">
                <div className="flex items-center gap-4">
                  <StudioLogo />
                  <button className="rounded-md border border-border bg-card px-3 py-1.5 text-xs">Replace mark</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    { label: "HYDROSEED Green", value: "#20B8E6" },
                    { label: "Sky", value: "#EAF8FC" },
                    { label: "Canvas", value: "#F5F9FC" },
                    { label: "Ink", value: "#172033" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-md border border-border p-3">
                      <div className="mono-label">{c.label}</div>
                      <div className="mt-2 h-10 rounded" style={{ background: c.value }} />
                      <div className="mt-1 font-mono text-xs">{c.value}</div>
                    </div>
                  ))}
                </div>
                <Row label="Display font" value="Fraunces (Variable)" />
                <Row label="Body font" value="Inter" />
                <Row label="Monospace font" value="JetBrains Mono" />
              </div>
            )}
            {section === "Domains" && (
              <div className="surface-card p-5 space-y-3">
                {["studio.hydroseed.app (Studio)", "hydroseed.app (Website)", "docs.hydroseed.app (Documentation)"].map((d) => (
                  <div key={d} className="flex items-center justify-between rounded-md border border-border p-3">
                    <span className="font-mono text-xs">{d}</span>
                    <span className="chip !bg-success/10 !text-success !border-success/20">Verified</span>
                  </div>
                ))}
              </div>
            )}
            {section === "Languages" && (
              <div className="surface-card p-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {LANGS.map((l) => (
                    <label key={l.code} className="flex items-center justify-between rounded-md border border-border p-3">
                      <span className="text-sm">{l.label} <span className="ml-1 chip font-mono">{l.code}</span></span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
                    </label>
                  ))}
                </div>
              </div>
            )}
            {section === "SEO defaults" && (
              <div className="surface-card p-5 space-y-4">
                <Row label="Default meta title suffix" value=" · HYDROSEED" />
                <Row label="Default meta description" value="Professional hydroseeding, erosion control and revegetation resources from HYDROSEED Studio." textarea />
                <Row label="Default Open Graph image" value="/og/hydroseed-default.jpg" mono />
                <Row label="Sitemap URL" value="https://hydroseed.app/sitemap.xml" mono />
                <Row label="Robots policy" value="index, follow" />
              </div>
            )}
            {section === "Integrations" && (
              <div className="surface-card p-5 grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Google Analytics 4", state: "Not connected" },
                  { name: "Search Console", state: "Not connected" },
                  { name: "Vercel Analytics", state: "Not connected" },
                  { name: "Slack notifications", state: "Not connected" },
                ].map((i) => (
                  <div key={i.name} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{i.name}</span>
                      <span className={`chip ${i.state === "Connected" ? "!bg-success/10 !text-success !border-success/20" : ""}`}>{i.state}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(section === "Publishing" || section === "Social defaults" || section === "Schema defaults" || section === "Notifications") && (
              <div className="surface-card p-10 text-center">
                <div className="mono-label mb-1">{section}</div>
                <h3 className="h-display text-xl">Configuration surface</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                  Fields for {section.toLowerCase()} will render here — the shell is ready and connects to workspace state.
                </p>
              </div>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}

function Row({ label, value, mono, textarea }: { label: string; value: string; mono?: boolean; textarea?: boolean }) {
  return (
    <label className="grid grid-cols-1 gap-1 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4 sm:items-center">
      <div className="mono-label">{label}</div>
      {textarea ? (
        <textarea defaultValue={value} className="w-full min-h-[70px] rounded-md border border-border bg-card p-2.5 text-sm" />
      ) : (
        <input defaultValue={value} className={`w-full h-9 rounded-md border border-border bg-card px-2.5 text-sm ${mono ? "font-mono text-xs" : ""}`} />
      )}
    </label>
  );
}
