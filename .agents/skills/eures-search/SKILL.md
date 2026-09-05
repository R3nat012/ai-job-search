---
name: eures-search
version: 1.0.0
description: >
  Use this skill when the user wants to search for jobs across the EU/EEA and
  Switzerland via EURES (European Employment Services), the EU's official
  cross-border job portal. Covers Germany, Austria, Spain, and other EU/EEA
  member states plus Switzerland — does NOT cover the UK, Japan, China, Taiwan,
  or Ukraine. Trigger phrases: EURES, EU jobs, European job search, jobs in
  Germany/Austria/Switzerland/Spain (EU market), ledige stillinger i EU,
  offene Stellen, Stellenangebote, europäische Jobsuche, "are there any X jobs
  in <EU country>".
context: fork
allowed-tools: Bash(bun run .agents/skills/eures-search/cli/src/cli.ts *)
---

# EURES Search Skill

Search live job vacancies from EURES's public job-search API, covering **EU/EEA
countries plus Switzerland** (Germany, Austria, Belgium, Bulgaria, Croatia, Cyprus,
Czechia, Denmark, Estonia, Finland, France, Greece, Hungary, Iceland, Ireland, Italy,
Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland,
Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, Switzerland). No authentication,
no API key, and **zero runtime dependencies** — it runs with just `bun`.

> This is a market-specific portal skill scaffolded by `/add-portal`. Per repo policy
> it lives in this fork rather than being merged upstream.

## ⚠️ Not an official, stable API

This uses a reverse-engineered EURES endpoint (see `url-reference.md`) — it is not a
published, versioned API contract. Endpoints or response shapes may change without
notice. Keep request volume low and treat it as best-effort.

## When to use this skill

- Search for job openings across EU/EEA countries and Switzerland — especially
  Germany, Austria, and Spain, which are common relocation targets
- Filter by recency (posted today / last 3 days / last week / last month)
- Get the full description and apply link for a specific EURES vacancy

**Does not cover:** UK, Japan, China, Taiwan, or Ukraine — use `linkedin-search`,
`freehire-search`, or a dedicated portal skill (`/add-portal`) for those markets.

## Commands

### Search job vacancies

```bash
bun run .agents/skills/eures-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (title, skill, or role). Recommended.
- `--location <text>` / `-l <text>` — comma-separated lowercase country codes, e.g. `"de,at,ch"`. Omit to search all EURES-covered countries at once.
- `--jobage <days>` — posted within N days, mapped to EURES's nearest bucket: `1` → last day, `3` → last 3 days, `7` → last week, `30`+ → last month. Omit for all postings.
- `--page <n>` — page number (1-indexed, 20 results per page).
- `--limit <n>` / `-n <n>` — cap total results emitted (client-side).
- `--lang <code>` — response language, ISO 639-1 (e.g. `en`, `de`). Default `en`.
- `--format json|table|plain` — default `json`.

### Fetch full vacancy detail

```bash
bun run .agents/skills/eures-search/cli/src/cli.ts detail <id|url> [--lang <code>] [--format json|plain]
```

`id` is the vacancy ID from `search` results (an opaque base64-style string, e.g.
`MTAwMDEtMTAwMjc3MDczNS1TIDE`). You may also pass a full `jv-details/...` portal URL.
Returns the full description, employer info, position schedule, and apply link.

## Usage examples

```bash
# Robotics roles across Germany, Austria, and Switzerland
bun run .agents/skills/eures-search/cli/src/cli.ts search -q "Robotics Engineer" -l "de,at,ch" --format table

# ROS2 roles in Germany, posted in the last week, German-language results
bun run .agents/skills/eures-search/cli/src/cli.ts search -q "ROS2" -l "de" --jobage 7 --lang de --format table

# Perception Engineer roles, no country filter (all EURES-covered countries)
bun run .agents/skills/eures-search/cli/src/cli.ts search -q "Perception Engineer" --format table

# Mechatronics roles in Spain
bun run .agents/skills/eures-search/cli/src/cli.ts search -q "Mechatronics Engineer" -l "es" --format table

# Full detail for a specific vacancy
bun run .agents/skills/eures-search/cli/src/cli.ts detail MTAwMDEtMTAwMjc3MDczNS1TIDE --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data is from EURES's public `jv-searchengine` endpoints — no credentials required.
- Page size is fixed at 20 results per page.
- Job IDs are opaque base64-style strings, not numeric — pass them as-is to `detail`.
- `--location` takes lowercase ISO-style country codes (`de`, `at`, `es`...), not free-text
  place names like LinkedIn's `--location`. Greece is `el`, not `gr`.
- `--jobage` maps to EURES's fixed publication-period buckets rather than an exact day count.
- The CLI retries 429/5xx with exponential backoff. Keep volume low (see ToS note above).
