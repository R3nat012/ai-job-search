# eures-cli

CLI for searching jobs on **EURES** (European Employment Services), the EU/EEA's
official cross-border job portal - covers EU/EEA countries plus Switzerland.

**Data source**: EURES public `jv-search/search` and `jv/id/<id>` endpoints (reverse-engineered, undocumented).
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

> **Not an official, stable API.** This documentation is based on observed behavior of
> the public EURES portal, not a published API contract. Endpoints or response shapes may
> change without notice. Keep volume low and run it on your own responsibility.

## Installation

```bash
cd .agents/skills/eures-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search job vacancies (all flags optional) |
| `detail` | Fetch full detail for a single job vacancy |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# Robotics roles in Germany, Austria, Switzerland
bun run src/cli.ts search -q "Robotics Engineer" -l "de,at,ch" --format table

# ROS2 roles in Germany, posted in the last week, German-language response
bun run src/cli.ts search -q "ROS2" -l "de" --jobage 7 --lang de --format table

# No country filter — searches all EURES-covered countries
bun run src/cli.ts search -q "Perception Engineer" --format table

# Full detail for one vacancy
bun run src/cli.ts detail MTAwMDEtMTAwMjc3MDczNS1TIDE --format plain
```

See `../SKILL.md` for the full flag reference and country coverage.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keywords (title / skill / role). |
| `--location` | `-l` | Comma-separated lowercase country codes, e.g. `"de,at,ch"`. Omit to search all covered countries. |
| `--jobage` | | Posted within N days — mapped to EURES's nearest bucket (day/3-day/week/month). |
| `--page` | | 1-indexed page (20 results/page). |
| `--limit` | `-n` | Cap results emitted. |
| `--lang` | | Response language, ISO 639-1 (e.g. `en`, `de`). Default `en`. |
| `--format` | | `json` \| `table` \| `plain`. |
