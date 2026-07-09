import { describe, vi, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { generateToken, decodeToken } from "./jwt.ts";
import { Temporal } from "@js-temporal/polyfill";

vi.mock("./cofig.ts", () => ({
  Config: {
    JWT: {
      get duration() {
        return Temporal.Duration.from({ minutes: 15 });
      },
      get secret() {
        return "secret";
      },
    },
  },
}));
vi.mock(import("jsonwebtoken"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    default: {
      ...actual,
      sign: vi.fn(),
      verify: vi.fn(),
    },
  };
});

describe("jwt", () => {
  describe("generateToken", () => {
    it("should generate an access token and return it along the expiresAt value", () => {
      vi.useFakeTimers();
      const mockDate = new Date("2026-04-05T12:00:00Z");
      vi.setSystemTime(mockDate);

      vi.mocked(jwt.sign).mockImplementation(() => "generated-token");

      const result = generateToken({
        id: 1,
        email: "test@test.io",
        otherField: "other",
      });

      expect(result.accessToken).toEqual("generated-token");
      expect(result.expiresAt).toBeDefined();

      const diff = result.expiresAt.since(Temporal.Now.instant(), {
        smallestUnit: "minutes",
      });

      expect(diff.minutes).toBeGreaterThanOrEqual(15);

      vi.useRealTimers();
    });
  });

  describe("decodeToken", () => {
    it("should call jwt.verify using Config.JWT.secret", () => {
      vi.mocked(jwt.verify).mockImplementation(() => ({
        id: 1,
        email: "test@test.io",
        otherField: "other",
      }));

      const result = decodeToken("token");
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: 1,
        email: "test@test.io",
        otherField: "other",
      });

      expect(jwt.verify).toHaveBeenCalledWith("token", "secret");
    });
  });
});
