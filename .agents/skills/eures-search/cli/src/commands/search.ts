import {
  SEARCH_URL,
  postJson,
  writeError,
  formatLocationMap,
  parseLocationCodes,
  jobageToPublicationPeriod,
  isoDate,
  makeSessionId,
  detailUrl,
  type JobResult,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  jobage: number
  page: number
  limit?: number
  lang: string
  format: "json" | "table" | "plain"
}

interface RawJv {
  id: string
  title: string
  creationDate: number | null
  locationMap?: Record<string, string[]> | null
  employer?: { name?: string | null } | null
}

interface RawSearchResponse {
  numberRecords: number
  jvs: RawJv[]
}

function buildBody(opts: SearchOpts): Record<string, unknown> {
  return {
    resultsPerPage: 20,
    page: opts.page,
    sortSearch: "BEST_MATCH",
    keywords: opts.query ? [{ keyword: opts.query, specificSearchCode: "EVERYWHERE" }] : [],
    publicationPeriod: jobageToPublicationPeriod(opts.jobage),
    occupationUris: [],
    skillUris: [],
    requiredExperienceCodes: [],
    positionScheduleCodes: [],
    sectorCodes: [],
    educationAndQualificationLevelCodes: [],
    positionOfferingCodes: [],
    locationCodes: parseLocationCodes(opts.location),
    euresFlagCodes: [],
    otherBenefitsCodes: [],
    requiredLanguages: [],
    minNumberPost: null,
    sessionId: makeSessionId(),
    userPreferredLanguage: null,
    requestLanguage: opts.lang,
  }
}

function toJobResult(jv: RawJv, lang: string): JobResult {
  return {
    id: jv.id,
    title: jv.title,
    company: jv.employer?.name ?? null,
    location: formatLocationMap(jv.locationMap),
    date: isoDate(jv.creationDate),
    url: detailUrl(jv.id, lang),
  }
}

function renderTable(results: JobResult[]): string {
  if (results.length === 0) return "No results."
  const rows = results.map((r) => {
    const title = (r.title || "").slice(0, 42).padEnd(42)
    const company = (r.company || "—").slice(0, 26).padEnd(26)
    const loc = (r.location || "—").slice(0, 12).padEnd(12)
    const date = r.date || "—"
    return `${r.id.padEnd(24)} ${title} ${company} ${loc} ${date}`
  })
  const header =
    "ID".padEnd(24) + " " + "TITLE".padEnd(42) + " " + "COMPANY".padEnd(26) + " " + "LOCATION".padEnd(12) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const data = await postJson<RawSearchResponse>(SEARCH_URL, buildBody(opts))
    let results = (data?.jvs ?? []).map((jv) => toJobResult(jv, opts.lang))
    if (opts.limit !== undefined && opts.limit >= 0) results = results.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(results) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        results
          .map(
            (r) =>
              `${r.title}\n  ${r.company || "—"} · ${r.location || "—"} · ${r.date || "—"}\n  id: ${r.id}\n  ${r.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify({ meta: { count: results.length, page: opts.page }, results }, null, 2) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
