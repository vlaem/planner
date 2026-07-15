import { describe, expect, it } from "vitest";

import { User } from "#src/domain/models/user.ts";
import { orm } from "#src/infra/db/mikro-orm.ts";

import { client } from "./setup/client.ts";

describe("/api/v1/Health", () => {
  describe("signup", () => {
    it("should return 200 OK", async () => {
      await orm.em.nativeDelete(User, {
        email: "signup-test@test.io",
      });

      const result = await client.api.v1.auth.signup.$post({
        json: {
          email: "signup-test@test.io",
          password: "valid-password",
        },
      });

      expect(result.status).toBe(201);
    });
  });
});
