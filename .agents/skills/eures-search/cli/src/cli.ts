#!/usr/bin/env bun
// Self-contained CLI for searching jobs on the EURES (European Employment Services)
// public job-search API. Covers EU/EEA countries plus Switzerland. No external CLI
// framework, so it runs anywhere `bun` is available with zero install beyond the
// repo clone.
//
// This uses a reverse-engineered, undocumented EURES API endpoint (see
// url-reference.md). It is not an official, stable API - keep volume low.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `eures-cli — search jobs on EURES (EU/EEA + Switzerland)

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <id|url> [--lang <code>] [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keywords (job title, skill, or role).
  --location, -l <text>   Comma-separated lowercase country codes, e.g. "de,at,ch".
                          Omit to search all EURES-covered countries.
  --jobage <days>         Posted within N days: mapped to EURES's nearest bucket
                          (1 -> LAST_DAY, 3 -> LAST_THREE_DAYS, 7 -> LAST_WEEK,
                          30+ -> LAST_MONTH). Omit for all postings.
  --page <n>              1-indexed page (20 results/page). Default 1.
  --limit, -n <n>         Cap results emitted (client-side).
  --lang <code>           Response language, ISO 639-1 (e.g. "en", "de"). Default "en".
  --format <fmt>          json (default) | table | plain.

EXAMPLES
  bun run src/cli.ts search -q "Robotics Engineer" -l "de,at,ch" --format table
  bun run src/cli.ts search -q "ROS2" -l "de" --jobage 7 --lang de --format table
  bun run src/cli.ts search -q "Perception Engineer" --format table
  bun run src/cli.ts detail MTAwMDEtMTAwMjc3MDczNS1TIDE --format plain

Data source: EURES public job-search API (reverse-engineered, not officially
documented or stable). Covers EU/EEA countries plus Switzerland only - it does
NOT cover the UK, Japan, China, Taiwan, or Ukraine.
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  const parseIntFlag = (name: string, raw: string | boolean | string[]): number | null => {
    const val = parseInt(raw as string, 10)
    if (isNaN(val)) {
      process.stderr.write(JSON.stringify({ error: `--${name} must be a number, got "${raw}"`, code: "BAD_ARG" }) + "\n")
      return null
    }
    return val
  }

  if (cmd === "search") {
    const fmt = (flags.format as string) || "json"

    if (flags.jobage !== undefined) {
      const v = parseIntFlag("jobage", flags.jobage)
      if (v === null) return 1
      flags.jobage = String(v)
    }
    if (flags.page !== undefined) {
      const v = parseIntFlag("page", flags.page)
      if (v === null) return 1
      flags.page = String(v)
    }
    if (flags.limit !== undefined) {
      const v = parseIntFlag("limit", flags.limit)
      if (v === null) return 1
      flags.limit = String(v)
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : 9999,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      lang: typeof flags.lang === "string" ? flags.lang : "en",
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: "detail requires an <id|url>", code: "NO_ID" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: DetailOpts = {
      id,
      lang: typeof flags.lang === "string" ? flags.lang : "en",
      format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"],
    }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main().then((code) => process.exit(code))
