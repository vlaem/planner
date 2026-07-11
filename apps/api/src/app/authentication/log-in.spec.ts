import { describe, vi, it, expect } from "vitest";

import { RefreshToken } from "#domain/models/refresh-token.ts";
import { User } from "#domain/models/user.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";
import { verifyPassword } from "#infra/passwords.ts";

import { InvalidUsernameOrPasswordError } from "./errors.ts";
import { logIn } from "./log-in.ts";

vi.mock("#infra/db/mikro-orm.ts");
vi.mock("#infra/passwords.ts");
vi.mock("#infra/jwt.ts");

describe("log-in", () => {
  describe("logIn", () => {
    it("should throw InvalidUsernameOrPasswordError when the user is not found", async () => {
      vi.mocked(orm.em.findOne).mockResolvedValueOnce(null);
      await expect(() => logIn("test@test.io", "password")).rejects.toThrow(
        InvalidUsernameOrPasswordError,
      );
    });
    it("should throw InvalidUsernameOrPasswordError when the user's password does not verify", async () => {
      const user = new (User as any)();
      user.password = "hashed";

      vi.mocked(orm.em.findOne).mockResolvedValueOnce(user);
      vi.mocked(verifyPassword).mockResolvedValueOnce(false);

      await expect(() => logIn("test@test.io", "password")).rejects.toThrow(
        InvalidUsernameOrPasswordError,
      );
    });
    it("should return a session payload when the user is found and the password verifies", async () => {
      const user = new (User as any)();
      user.password = "hashed";
      const newRefreshToken = new (RefreshToken as any)();
      newRefreshToken.id = "generated-refresh-token-id";

      vi.mocked(orm.em.findOne).mockResolvedValueOnce(user);
      vi.mocked(verifyPassword).mockResolvedValueOnce(true);
      vi.spyOn(RefreshToken, "createFor").mockReturnValueOnce(newRefreshToken);
      vi.mocked(generateToken).mockReturnValueOnce({
        accessToken: "generated-access-token",
        expiresAt: Temporal.Now.instant(),
      });

      const result = await logIn("test@email.io", "password");

      expect(orm.em.flush).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        accessToken: "generated-access-token",
        refreshToken: "generated-refresh-token-id",
      });
    });
  });
});
