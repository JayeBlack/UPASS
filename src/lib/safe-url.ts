const SAFE_PROTOCOLS = import.meta.env.DEV
  ? new Set(["https:", "http:"])
  : new Set(["https:"]);

export function resolveSafeAssetUrl(rawUrl: string | null | undefined, baseUrl?: string): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    if (/^(https?:)?\/\//i.test(trimmed)) {
      const parsed = new URL(trimmed);
      if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;
      return parsed.toString();
    }

    if (trimmed.startsWith("/")) {
      const base = baseUrl ? new URL(baseUrl) : undefined;
      if (!base) return null;
      const parsed = new URL(trimmed, base);
      if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;
      return parsed.toString();
    }

    return null;
  } catch {
    return null;
  }
}
