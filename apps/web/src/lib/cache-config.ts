/**
 * Global cache revalidation TTL (seconds).
 * Override with CACHE_REVALIDATE_SECONDS env var.
 * Set to 0 to disable time-based revalidation (tag-based only).
 */
export const CACHE_REVALIDATE_SECONDS: number =
  process.env.CACHE_REVALIDATE_SECONDS !== undefined
    ? Number(process.env.CACHE_REVALIDATE_SECONDS)
    : 300
