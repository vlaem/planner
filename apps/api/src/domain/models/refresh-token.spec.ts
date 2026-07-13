import { describe, vi, it, expect } from "vitest";

import { RefreshToken } from "./refresh-token.ts";
import { User } from "./user.ts";

describe("RefreshToken", () => {
  describe("createFor", () => {
    it("should create the new RefreshToken for a User and return the expiresIn value", () => {
      vi.useFakeTimers();
      const mockDate = new Date("2026-04-05T12:00:00Z");
      vi.setSystemTime(mockDate);

      const user = new (User as any)();
      const result = RefreshToken.createFor(user);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        refreshToken: expect.any(RefreshToken),
        expiresIn: expect.any(Temporal.Duration),
      });

      vi.useRealTimers();
    });
  });
  describe("extendFrom", () => {
    it("should create the new RefreshToken from another RefreshToken and return the expiresIn value", () => {
      vi.useFakeTimers();
      const mockDate = new Date("2026-04-05T12:00:00Z");
      vi.setSystemTime(mockDate);

      const user = new (User as any)();
      const prevRefreshToken = new (RefreshToken as any)();
      prevRefreshToken.user = user;
      prevRefreshToken.expiresAt = Temporal.Now.instant().add(
        Temporal.Duration.from({ hours: 24 }),
      );

      const result = RefreshToken.extendFrom(prevRefreshToken);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        refreshToken: expect.any(RefreshToken),
        expiresIn: expect.any(Temporal.Duration),
      });
      expect(result.refreshToken.user).toEqual(user);

      vi.useRealTimers();
    });
  });
});
