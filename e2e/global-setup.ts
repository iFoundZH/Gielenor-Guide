import type { FullConfig } from "@playwright/test";

const PAGES = ["/", "/calculator", "/items", "/formulas"];

export default async function globalSetup(_config: FullConfig) {
  // Warm up pages by fetching them to trigger compilation
  const baseURL = "http://localhost:3000";

  for (const page of PAGES) {
    try {
      await fetch(`${baseURL}${page}`);
    } catch {
      // Server may not be ready yet during warmup — that's fine
    }
  }
}
