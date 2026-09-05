import {
  DETAIL_URL,
  getJson,
  writeError,
  cleanDescription,
  formatLocationsArray,
  extractApplyUrl,
  isoDate,
  detailUrl,
  type JobDetailResult,
} from "../helpers.js"

export interface DetailOpts {
  id: string
  lang: string
  format: "json" | "plain"
}

interface RawJvProfile {
  title: string
  description?: string | null
  positionScheduleCodes?: string[] | null
  positionOfferingCode?: string | null
  locations?: Array<{ countryCode?: string | null; cityName?: string | null }> | null
  employer?: { name?: string | null; website?: string | null } | null
  applicationInstructions?: string[] | string | null
}

interface RawJvDetail {
  id: string
  creationDate: number | null
  jvProfiles: Record<string, RawJvProfile>
}

/** Accept a raw base64-style EURES ID or a jv-details portal URL. */
function normalizeId(input: string): string | null {
  const url = input.match(/jv-details\/([^/?]+)/)
  if (url) return url[1]
  if (/^[A-Za-z0-9+/=_-]{6,}$/.test(input)) return input
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    writeError(`Could not parse a job ID from "${opts.id}"`, "BAD_ID")
    return 1
  }
  try {
    const data = await getJson<RawJvDetail>(`${DETAIL_URL}/${id}?requestLang=${opts.lang}`)
    if (!data) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const profile = data.jvProfiles[opts.lang] ?? Object.values(data.jvProfiles)[0]
    if (!profile) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }

    const job: JobDetailResult = {
      id: data.id,
      title: profile.title,
      company: profile.employer?.name ?? null,
      location: formatLocationsArray(profile.locations),
      date: isoDate(data.creationDate),
      url: detailUrl(data.id, opts.lang),
      description: cleanDescription(profile.description),
      employmentType: profile.positionScheduleCodes?.length ? profile.positionScheduleCodes.join(", ") : null,
      positionOffering: profile.positionOfferingCode ?? null,
      employerWebsite: profile.employer?.website ?? null,
      applyUrl: extractApplyUrl(profile.applicationInstructions),
    }

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"}`,
        "",
        job.employmentType ? `Schedule: ${job.employmentType}` : "",
        job.positionOffering ? `Offering: ${job.positionOffering}` : "",
        job.employerWebsite ? `Employer site: ${job.employerWebsite}` : "",
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
        job.applyUrl ? `Apply: ${job.applyUrl}` : "",
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
