import { hc } from "hono/client";

import type { AppType } from "#api/app.ts";

if (!process.env.INTEGRATION_TESTS_BASE_URL) {
  throw new Error("INTEGRATION_TESTS_BASE_URL environment variable is not set");
}

export type Client = ReturnType<typeof hc<AppType>>;

const hcWithType = (...args: Parameters<typeof hc>): Client => hc<AppType>(...args);

export const client = hcWithType(process.env.INTEGRATION_TESTS_BASE_URL);
