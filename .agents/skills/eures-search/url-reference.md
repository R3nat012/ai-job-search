# EURES Job Search API Reference

Public, unauthenticated JSON API used by this skill, reverse-engineered from the EURES
portal at `https://europa.eu/eures/portal`. **Not an official or documented API** — no
guaranteed stability, rate limits, or support. Community documentation:
https://rorar.github.io/EURES-API-Documentation/ (OpenAPI 3.1.0 spec, MIT-licensed, maintained
independently of the EU).

`robots.txt` at `europa.eu` does not disallow the `/eures/` paths used here (checked at scaffold time).

## Search

```
POST https://europa.eu/eures/api/jv-searchengine/public/jv-search/search
Content-Type: application/json
```

Request body (all filter arrays accept `[]` for "no filter"):

| Field | Meaning | Example |
|-------|---------|---------|
| `resultsPerPage` | Page size | `20` |
| `page` | 1-indexed page number | `1` |
| `sortSearch` | `BEST_MATCH` \| `MOST_RECENT` | `BEST_MATCH` |
| `keywords` | Array of `{ keyword, specificSearchCode }` | `[{"keyword":"robotics engineer","specificSearchCode":"EVERYWHERE"}]` |
| `publicationPeriod` | `LAST_DAY` \| `LAST_THREE_DAYS` \| `LAST_WEEK` \| `LAST_MONTH` \| `LAST_VISIT` (auth-only) \| `null` | `LAST_WEEK` |
| `locationCodes` | Array of lowercase country codes | `["de","at","ch"]` |
| `requestLanguage` | ISO 639-1 language for returned text | `"en"` |
| `sessionId` | Arbitrary session string (no auth) | `"session-abc123"` |
| ...other filter arrays | `occupationUris`, `skillUris`, `requiredExperienceCodes`, `positionScheduleCodes`, `sectorCodes`, `educationAndQualificationLevelCodes`, `positionOfferingCodes`, `euresFlagCodes`, `otherBenefitsCodes`, `requiredLanguages` | not used by this CLI — left as `[]` |

Response: `{ numberRecords, jvs: [...], facets: {...} }`. Each `jv` includes `id`
(opaque, base64-style string), `title`, `description` (HTML, primary-language version),
`creationDate`/`lastModificationDate` (epoch millis), `employer.name`, and `locationMap`
(`{ COUNTRY_CODE: [NUTS region codes] }`).

## Detail

```
GET https://europa.eu/eures/api/jv-searchengine/public/jv/id/{id}?requestLang={lang}
```

`id` is the same opaque ID from search results. Response has `jvProfiles`, a map keyed by
language code (e.g. `"de"`, `"en"`) — use whichever key matches the request, or fall back
to the first available. Each profile carries `title`, `description` (HTML), `employer`
(`name`, `website`), `locations` (array with `countryCode`, `cityName`), `positionScheduleCodes`,
`positionOfferingCode`, and `applicationInstructions` (free text, usually embedding an apply
URL — no dedicated `applyUrl` field).

## Public detail page (for the `url` field in results)

```
https://europa.eu/eures/portal/jv-se/jv-details/{id}?lang={lang}
```

Confirmed to resolve (HTTP 200) for IDs returned by the search endpoint.

## Reference data

```
GET https://europa.eu/eures/api/shared-data-rest-api/public/reference/countries
```

Returns the list of country codes EURES covers (uppercase in this endpoint, but the search
endpoint's `locationCodes` filter expects lowercase — confirmed working in testing):

`AT BE BG HR CY CZ DK EE FI FR DE EL HU IS IE IT LV LI LT LU MT NL NO PL PT RO SK SI ES SE CH`

**Notably absent: UK, Japan, China, Taiwan, Ukraine.** EURES only covers EU/EEA member
states plus Switzerland (`EL` = Greece; `IS`/`LI`/`NO` = EEA members Iceland/Liechtenstein/Norway).

## Notes

- No authentication or API key required for any endpoint used here.
- `sessionId` can be any string — it does not need to come from a real browser session.
- Job IDs are opaque base64-style strings (e.g. `MTAwMDEtMTAwMjc3MDczNS1TIDE`), not numeric.
- `description` and `applicationInstructions` contain raw HTML (`<br>`, `<p>`, entity-escaped
  accented characters) — strip and decode before display.
- This is a reverse-engineered endpoint. If the portal changes its markup/schema, re-run the
  investigation steps in `/add-portal` and update this file.
