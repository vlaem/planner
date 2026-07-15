import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";

import { HealthRoute } from "./health.ts";

describe("GET /", () => {
  const client = testClient(HealthRoute);

  it("should return 200 OK", async () => {
    const res = await client.index.$get();

    expect(res.status).toBe(200);
  });
});
