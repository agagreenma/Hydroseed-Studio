import { supabase } from "@/integrations/supabase/client";
import { studioUrl } from "@/lib/site";

type PublishedSitemapRow = {
  slug: string;
  type: "article" | "blog_post";
  status: string;
  scheduled_at: string | null;
  seo: Record<string, unknown> | null;
};

type ActiveRedirect = {
  destination: string;
  status_code: number;
};

function isIndexable(seo: Record<string, unknown> | null): boolean {
  if (!seo) return true;
  if (seo.indexable === false || seo.noindex === true) return false;
  return !String(seo.robots ?? "").toLowerCase().includes("noindex");
}

function canonicalUrl(row: PublishedSitemapRow): string {
  const configured = typeof row.seo?.canonical_url === "string" ? row.seo.canonical_url.trim() : "";
  return configured || studioUrl(`/journal/articles/${row.slug}`);
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);
}

export async function renderSitemap(): Promise<Response> {
  const { data, error } = await supabase
    .from("content_items")
    .select("slug, type, status, scheduled_at, seo")
    .in("type", ["article", "blog_post"])
    .eq("status", "published")
    .or(`scheduled_at.is.null,scheduled_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);

  const urls = new Set<string>([studioUrl("/journal")]);
  for (const row of (data ?? []) as unknown as PublishedSitemapRow[]) {
    if (isIndexable(row.seo)) urls.add(canonicalUrl(row));
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(urls, (url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    "</urlset>",
  ].join("\n");
  return new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

export function renderRobots(): Response {
  const body = [
    "User-agent: *",
    "Disallow: /",
    "Allow: /journal",
    "Allow: /learn",
    "Disallow: /auth",
    "Disallow: /content",
    "Disallow: /team",
    "Disallow: /settings",
    "Disallow: /seo",
    "Disallow: /redirects",
    "Disallow: /media",
    `Sitemap: ${studioUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

export async function resolveRedirect(pathname: string): Promise<Response | null> {
  if (pathname.includes(".")) return null;
  if (pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/content") || pathname.startsWith("/team") || pathname.startsWith("/settings") || pathname.startsWith("/seo") || pathname.startsWith("/redirects") || pathname.startsWith("/media") || pathname.startsWith("/admin")) {
    return null;
  }

  const { data, error } = await supabase
    .from("redirects")
    .select("destination, status_code")
    .eq("source_path", pathname)
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return null;

  const redirect = data as ActiveRedirect;
  if (redirect.destination === pathname || ![301, 302].includes(redirect.status_code)) return null;
  return new Response(null, {
    status: redirect.status_code,
    headers: { location: redirect.destination },
  });
}