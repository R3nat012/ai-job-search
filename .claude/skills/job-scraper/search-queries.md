# Search Queries for Job Scraper

<!-- SETUP: Customize these queries based on your skills, target roles, and location -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. Shipped country-agnostic CLIs include `linkedin-search` and `freehire-search`; Danish demos and any skill you add with `/add-portal` are included the same way. You do **not** need a matching `site:` line below for those CLIs to run.

`eures-search` (added via `/add-portal`) covers EU/EEA countries plus Switzerland — Germany, Austria, Spain, and other ideal-tier markets. It does **not** cover the UK, Japan, China, Taiwan, or Ukraine; the `site:` fallback below still applies to those.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

## Search Sites

Primary (no country-specific board configured yet - run `/add-portal` for Peru/LatAm or a DACH-region board when ready):
- **indeed.com** - general global job board covering most target markets (Germany, Switzerland, Austria, Spain, UK, Japan, China, Taiwan, Ukraine)
- **linkedin.com/jobs** - LinkedIn job listings (filter: Peru / target countries / Remote); also covered by `linkedin-search` CLI
- **freehire-search** CLI - covers remote-first listings

Secondary (company career pages via Google):
- Direct Google searches with `site:` filters for target companies: ABB, FANUC, NVIDIA, and robotics research groups at universities in Germany, Switzerland, and Ukraine
- **tokyodev.com** (WebSearch-only) - English-language job board for engineers in Japan; covers your Japan ideal-tier target. No CLI: the site actively blocks non-browser HTTP access with a Cloudflare JS challenge (confirmed on `/jobs/robotics` during `/add-portal` investigation on 2026-07-15), so this only works via WebSearch's `site:` queries below, never via direct fetch/curl
- **euroengineerjobs.com** (WebSearch-only) - Europe-wide engineering job board with a dedicated Robotics Engineer category (ARX Robotics, ESRF, GE Vernova, Harmattan AI, Tesla listed at investigation time); covers Germany/Austria/Switzerland/Spain ideal-tier markets. No CLI: `robots.txt` explicitly disallows `ClaudeBot` (and other named AI-company crawlers) while allowing generic user agents (checked 2026-07-15) - a direct opt-out of AI-agent access, so this only works via WebSearch's `site:` queries below, never via direct fetch/curl under a browser identity

## Query Categories

Queries are grouped by priority. Each query should be combined with your location terms (e.g. your city, region, or metro area) where the site supports it.

### Priority 1: AMR / Autonomous Systems / Perception

These match your strongest and most desired career direction.

```
site:indeed.com "Robotics Software Engineer" Remote
site:indeed.com "Autonomous Systems Engineer" Remote
site:indeed.com "ROS2" Remote
site:linkedin.com/jobs "Perception Engineer" Remote
site:linkedin.com/jobs "Robotics Software Engineer" Germany OR Switzerland OR Austria OR Spain OR UK OR Japan OR "Taiwan" OR Ukraine
site:tokyodev.com "Robotics" OR "Robotics Engineer"
site:euroengineerjobs.com "Robotics Engineer"
```

### Priority 2: Robotics / Mechatronics Domain Expertise

These match your domain expertise.

```
site:indeed.com SLAM Remote OR Germany OR Switzerland
site:indeed.com Nav2 Remote OR Europe
site:linkedin.com/jobs SLAM Lima Peru
site:linkedin.com/jobs "Mechatronics Engineer" Germany OR Switzerland OR Austria OR Spain OR UK
```

### Priority 3: Humanoid Robotics / Embedded Systems

Adjacent roles you could pivot into, including entry-level humanoid robotics.

```
site:indeed.com "Humanoid Robotics" entry level ROS2
site:indeed.com "Embedded Systems Engineer" ROS2 Remote
site:linkedin.com/jobs "Humanoid Robotics Engineer" junior OR entry
```

### Priority 4: Broader Technical / Research

Wider net, including academic/research robotics roles.

```
site:indeed.com ROS2 developer Remote
site:linkedin.com/jobs "ROS2 developer" Remote
site:indeed.com "research engineer" robotics Germany OR Switzerland OR Ukraine
```

## Location Filter

Given a remote-first, relocation-open search (not a single-city commute), define acceptable areas as:
- **Ideal (relocation with visa sponsorship):** Germany, Switzerland, Austria, Spain, UK, Japan, China, Taiwan, Ukraine
- **Acceptable:** Fully remote, open globally
- **Borderline (local base):** Lima, Peru
- **Too far:** None excluded - flag any location requiring self-funded relocation (no sponsorship offered) for discussion

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
