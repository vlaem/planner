import { describe, vi, it, expect } from "vitest";

import { RefreshToken } from "#domain/models/refresh-token.ts";
import { orm } from "#infra/db/mikro-orm.ts";
import { generateToken } from "#infra/jwt.ts";

import { InvalidRefreshTokenError } from "./errors.ts";
import { refresh } from "./refresh.ts";

vi.mock("#infra/db/mikro-orm.ts");
vi.mock("#infra/passwords.ts");
vi.mock("#infra/jwt.ts");

describe("refresh", () => {
  describe("refresh", () => {
    it("should throw InvalidRefreshTokenError if the token is not found", async () => {
      vi.mocked(orm.em.findOne).mockResolvedValueOnce(null);

      await expect(() => refresh("refresh-token-id")).rejects.toThrow(InvalidRefreshTokenError);
    });
    it("should return a new token payload when the refresh token id is valid", async () => {
      const prevRefreshToken = new (RefreshToken as any)();
      const newRefreshToken = new (RefreshToken as any)();
      newRefreshToken.id = "generated-refresh-token-id";
      const expiresIn = new Temporal.Duration(1);

      vi.mocked(orm.em.findOne).mockResolvedValueOnce(prevRefreshToken);
      vi.spyOn(RefreshToken, "extendFrom").mockReturnValueOnce({
        refreshToken: newRefreshToken,
        expiresIn,
      });
      vi.mocked(generateToken).mockReturnValueOnce({
        accessToken: "generated-access-token",
        expiresAt: Temporal.Now.instant(),
      });

      const result = await refresh("refresh-token-id");

      expect(orm.em.flush).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        accessToken: "generated-access-token",
        refreshToken: "generated-refresh-token-id",
        refreshTokenExpiresIn: expect.any(Temporal.Duration),
      });
    });
  });
});
