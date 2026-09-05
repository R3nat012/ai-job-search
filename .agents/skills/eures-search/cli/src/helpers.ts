// Data source: EURES (European Employment Services) public job-search JSON API,
// reverse-engineered from https://europa.eu/eures/portal. No authentication required.
// Covers EU/EEA countries plus Switzerland (see url-reference.md for the country list —
// notably it does NOT cover the UK, Japan, China, Taiwan, or Ukraine).
//
// This is not an official, documented API - endpoints and shapes reflect observed
// behavior of the public portal and may change without notice.

export const SEARCH_URL = "https://europa.eu/eures/api/jv-searchengine/public/jv-search/search"
export const DETAIL_URL = "https://europa.eu/eures/api/jv-searchengine/public/jv/id"
export const PORTAL_DETAIL_URL = "https://europa.eu/eures/portal/jv-se/jv-details"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/** POST a JSON body with exponential backoff on 429/5xx. Returns null on a 404. */
export async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return (await response.json()) as T
  }
  throw new Error("Request failed after max retries")
}

/** GET JSON with the same backoff policy. Returns null on a 404. */
export async function getJson<T>(url: string): Promise<T | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return (await response.json()) as T
  }
  throw new Error("Request failed after max retries")
}

export interface JobResult {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface JobDetailResult extends JobResult {
  description: string | null
  employmentType: string | null
  positionOffering: string | null
  employerWebsite: string | null
  applyUrl: string | null
}

function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

/** Strip HTML tags from a job description while preserving paragraph/line breaks. */
export function cleanDescription(html: string | null | undefined): string | null {
  if (!html) return null
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
  const text = decodeHtmlEntities(withBreaks.replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  return text || null
}

/** EURES search results carry a locationMap of { COUNTRY_CODE: [NUTS region codes] }. */
export function formatLocationMap(locationMap: Record<string, string[]> | null | undefined): string | null {
  if (!locationMap) return null
  const countries = Object.keys(locationMap)
  return countries.length ? countries.map((c) => c.toUpperCase()).join(", ") : null
}

/** Detail responses carry a richer locations array with city names. */
export function formatLocationsArray(
  locations: Array<{ countryCode?: string | null; cityName?: string | null }> | null | undefined,
): string | null {
  if (!locations || !locations.length) return null
  const parts = locations
    .map((l) => [l.cityName, l.countryCode ? l.countryCode.toUpperCase() : null].filter(Boolean).join(", "))
    .filter(Boolean)
  return parts.length ? parts.join("; ") : null
}

/** Parse a comma-separated --location value into lowercase EURES country codes. */
export function parseLocationCodes(location: string | undefined): string[] {
  if (!location) return []
  return location
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/** Map a --jobage day count to EURES's publicationPeriod bucket (approximate). */
export function jobageToPublicationPeriod(days: number | undefined): string | null {
  if (days === undefined || days < 0 || days >= 9999) return null
  if (days <= 1) return "LAST_DAY"
  if (days <= 3) return "LAST_THREE_DAYS"
  if (days <= 7) return "LAST_WEEK"
  return "LAST_MONTH"
}

/** applicationInstructions is free text (localized) that usually embeds an apply URL. */
export function extractApplyUrl(instructions: string[] | string | null | undefined): string | null {
  if (!instructions) return null
  const text = Array.isArray(instructions) ? instructions.join(" ") : instructions
  const m = text.match(/https?:\/\/[^\s"<]+/)
  return m ? decodeHtmlEntities(m[0]) : null
}

export function isoDate(epochMillis: number | null | undefined): string | null {
  if (!epochMillis) return null
  const d = new Date(epochMillis)
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
}

export function makeSessionId(): string {
  return `session-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

export function detailUrl(id: string, lang: string): string {
  return `${PORTAL_DETAIL_URL}/${id}?lang=${lang}`
}
