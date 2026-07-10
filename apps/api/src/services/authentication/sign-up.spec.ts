import { describe, vi, it, expect } from "vitest";
import { signUp } from "./sign-up.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { EmailAlreadyTakenError } from "./errors.ts";

vi.mock("#infra/db/mikro-orm.ts");

describe("sign-up", () => {
  describe("signUp", () => {
    it("should return an ErrorResult when the email is already taken", async () => {
      vi.mocked(orm.em.findOne).mockResolvedValueOnce({
        id: 1,
      } as any);

      await expect(() => signUp("test@email.io", "testpassword")).rejects.toThrow(
        EmailAlreadyTakenError,
      );
    });
  });
});
