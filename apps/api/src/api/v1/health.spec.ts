import { describe, expect, it } from "vitest";
import { HealthRoute } from "./health.ts";

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const res = await HealthRoute.request("/", {
      method: "GET",
    });

    expect(res.status).toBe(200);
  });
});
