import { describe, expect, it, assert } from "vitest";

import { User } from "#src/domain/models/user.ts";
import { orm } from "#src/infra/db/mikro-orm.ts";

import { client } from "./setup/client.ts";

describe("/api/v1/Health", () => {
  describe("signup", () => {
    it("should return 200 OK", async () => {
      await orm.em.nativeDelete(User, {
        email: "signup-test@test.io",
      });

      const response = await client.api.v1.auth.signup.$post({
        json: {
          email: "signup-test@test.io",
          password: "valid-password",
        },
      });

      assert(response.status == 201, "Response status is not 201");

      const result = await response.json();
      expect(result).toMatchObject({
        accessToken: expect.any(String),
      });
    });
  });
});
