const FALLBACK_SITE_URL = "https://nandini-yoga.vercel.app";

export const SITE_NAME = "Yoga By Nandini";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");
export const SITE_IMAGE = `${SITE_URL}/logo.png`;
export const SITE_DESCRIPTION =
  "Online yoga, meditation, pranayama, and mindful living guidance with Nandini Singh, a certified yoga teacher with 15+ years of teaching experience.";

export const PERSON_NAME = "Nandini Singh";

export function absoluteUrl(path = "/") {
  if (!path) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function cleanText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

export function truncateText(value = "", maxLength = 160) {
  const normalized = cleanText(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}
