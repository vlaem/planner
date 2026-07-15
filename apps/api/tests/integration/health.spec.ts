import { describe, expect, it } from "vitest";

import { client } from "./setup/client.ts";

describe("/api/v1/Health", () => {
  describe("GET /", () => {
    it("should return 200 OK", async () => {
      const result = await client.api.v1.health.$get();

      expect(result.status).toBe(200);
    });
  });
});
