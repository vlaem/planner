import { describe, vi, it, expect } from "vitest";

import { RefreshToken } from "#domain/models/refresh-token.ts";
import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";

import { EmailAlreadyTakenError } from "./errors.ts";
import { signUp } from "./sign-up.ts";

vi.mock("#infra/db/mikro-orm.ts");
vi.mock("#infra/jwt.ts");

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
    it("should return the generated access token and refresh token", async () => {
      const newUser = new (User as any)();
      const newRefreshToken = new (RefreshToken as any)();
      newRefreshToken.id = "generated-refresh-token-id";

      vi.mocked(orm.em.findOne).mockResolvedValueOnce(null);
      vi.spyOn(RefreshToken, "createFor").mockReturnValueOnce(newRefreshToken);
      vi.mocked(orm.em.create).mockResolvedValueOnce(newUser);
      vi.mocked(generateToken).mockReturnValueOnce({
        accessToken: "generated-access-token",
        expiresAt: Temporal.Now.instant(),
      });

      const result = await signUp("test@email.io", "testpassword");

      expect(orm.em.flush).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        accessToken: "generated-access-token",
        refreshToken: "generated-refresh-token-id",
      });
    });
  });
});
