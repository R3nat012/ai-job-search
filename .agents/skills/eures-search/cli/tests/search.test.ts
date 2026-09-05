import { describe, test, expect } from "bun:test";
import { runCLI, parseJSON } from "./helpers.js";

interface JobResult {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  date: string | null;
  url: string;
}
interface SearchResponse {
  meta: { count: number; page: number };
  results: JobResult[];
}
interface JobDetail extends JobResult {
  description: string | null;
}

describe("eures-search live smoke test", () => {
  test("search returns real results for the test query", async () => {
    const result = await runCLI(["search", "-q", "Robotics Engineer", "-l", "de", "--limit", "5"]);
    const data = parseJSON<SearchResponse>(result);
    expect(data.results.length).toBeGreaterThan(0);
    const first = data.results[0];
    expect(first.id).toBeTruthy();
    expect(first.title).toBeTruthy();
    expect(first.url).toContain("europa.eu/eures/portal");
  }, 30000);

  test("detail returns a readable description for a result from search", async () => {
    const search = await runCLI(["search", "-q", "Robotics Engineer", "-l", "de", "--limit", "1"]);
    const { results } = parseJSON<SearchResponse>(search);
    expect(results.length).toBeGreaterThan(0);

    const detail = await runCLI(["detail", results[0].id, "--format", "json"]);
    const job = parseJSON<JobDetail>(detail);
    expect(job.title).toBeTruthy();
    expect(job.description).toBeTruthy();
  }, 30000);

  test("missing detail id exits 1 with a JSON error on stderr", async () => {
    const result = await runCLI(["detail"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("NO_ID");
  });

  test("unknown command exits 1 with a JSON error on stderr", async () => {
    const result = await runCLI(["bogus-command"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("BAD_CMD");
  });
});
