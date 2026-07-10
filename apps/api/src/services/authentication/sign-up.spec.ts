import { describe, vi, it, expect } from "vitest";
import { signUp } from "./sign-up.ts";
import { orm } from "#infra/db/mikro-orm.ts";

vi.mock("#infra/db/mikro-orm.ts");

describe("sign-up", () => {
  describe("signUp", () => {
    it("should return an ErrorResult when the email is already taken", async () => {
      vi.mocked(orm.em.findOne).mockResolvedValueOnce({
        id: 1,
      } as any);

      const result = await signUp("test@email.io", "testpassword");

      expect(result.error).toBeDefined();
    });
  });
});
