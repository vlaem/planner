import { describe, it } from "vitest";

import { client } from "./setup/client.ts";

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const result = await client.api.v1.health.$get();

    console.log(result.status);
  });
});
