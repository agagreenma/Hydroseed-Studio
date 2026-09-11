/**
 * HYDROSEED Studio — canonical origins (Phase 1 infrastructure foundation).
 *
 * Studio is hosted independently from the public product site. Nothing here may
 * point Studio-owned URLs at hydroseed.app hosting.
 *
 * VITE_STUDIO_PUBLIC_URL is set per environment (see .env.example). The fallback
 * is the approved production origin from Architecture Blueprint Revision 2.0.
 */
export const STUDIO_ORIGIN: string =
  (import.meta.env["VITE_STUDIO_PUBLIC_URL"] as string | undefined)?.replace(/\/$/, "") ||
  "https://studio.hydroseed.app";

/** The public product site. Referenced for content only — never for Studio hosting. */
export const PRODUCT_SITE_ORIGIN = "https://hydroseed.app";

/** Absolute Studio URL for canonical tags, OG URLs and JSON-LD. */
export function studioUrl(path: string): string {
  return `${STUDIO_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
