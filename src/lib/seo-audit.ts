import type { SeoAuditData, SeoAuditItem } from "@/lib/studio-api";

export type SeoAuditIssue = {
  id: string;
  severity: "warn";
  issue: string;
  page: string;
  type: string;
  detected: string;
  action: string;
};

export type SeoAudit = {
  total: number;
  withTitle: number;
  withoutTitle: number;
  withDescription: number;
  withoutDescription: number;
  withCanonical: number;
  withoutCanonical: number;
  withCover: number;
  withoutCover: number;
  mediaMissingAlt: number;
  statusCounts: Record<string, number>;
  issues: SeoAuditIssue[];
};

function hasValue(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function pagePath(item: SeoAuditItem): string {
  return `/content/${item.id}`;
}

export function auditSeoItems({ items, mediaAssets }: SeoAuditData): SeoAudit {
  const statusCounts: Record<string, number> = {};
  const issues: SeoAuditIssue[] = [];
  let withTitle = 0;
  let withDescription = 0;
  let withCanonical = 0;
  let withCover = 0;

  for (const item of items) {
    const seo = item.seo && typeof item.seo === "object" && !Array.isArray(item.seo)
      ? (item.seo as Record<string, unknown>)
      : {};
    const page = pagePath(item);
    statusCounts[item.status] = (statusCounts[item.status] ?? 0) + 1;

    if (hasValue(seo.meta_title)) {
      withTitle += 1;
    } else {
      issues.push({
        id: `${item.id}:meta-title`,
        severity: "warn",
        issue: "Missing SEO title",
        page,
        type: "SEO title",
        detected: "Live audit",
        action: "Add a meta title in the content editor.",
      });
    }

    if (hasValue(seo.meta_description)) {
      withDescription += 1;
    } else {
      issues.push({
        id: `${item.id}:meta-description`,
        severity: "warn",
        issue: "Missing meta description",
        page,
        type: "Description",
        detected: "Live audit",
        action: "Add a meta description in the content editor.",
      });
    }

    if (hasValue(seo.canonical_url)) {
      withCanonical += 1;
    } else {
      issues.push({
        id: `${item.id}:canonical`,
        severity: "warn",
        issue: "Missing canonical URL",
        page,
        type: "Canonical",
        detected: "Live audit",
        action: "Add a canonical URL in the content editor.",
      });
    }

    if (item.cover_media_id) {
      withCover += 1;
      if (item.media_assets && !hasValue(item.media_assets.alt_text)) {
        issues.push({
          id: `${item.id}:alt-text`,
          severity: "warn",
          issue: "Missing cover image alt text",
          page,
          type: "Alt text",
          detected: "Live audit",
          action: `Add alt text for ${item.media_assets.filename}.`,
        });
      }
    } else {
      issues.push({
        id: `${item.id}:cover`,
        severity: "warn",
        issue: "Missing cover image",
        page,
        type: "Media",
        detected: "Live audit",
        action: "Assign a cover image in the content editor.",
      });
    }
  }

  return {
    total: items.length,
    withTitle,
    withoutTitle: items.length - withTitle,
    withDescription,
    withoutDescription: items.length - withDescription,
    withCanonical,
    withoutCanonical: items.length - withCanonical,
    withCover,
    withoutCover: items.length - withCover,
    mediaMissingAlt: mediaAssets.filter((media) => !hasValue(media.alt_text)).length,
    statusCounts,
    issues,
  };
}