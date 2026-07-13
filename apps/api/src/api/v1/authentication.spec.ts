import { testClient } from "hono/testing";
import { describe, expect, it, vi } from "vitest";

import { EmailAlreadyTakenError } from "#app/authentication/errors.ts";
import { signUp } from "#app/authentication/sign-up.ts";

import { AuthenticationRoute } from "./authentication.ts";

vi.mock("#app/authentication/sign-up.ts");

describe("AuthenticationRoute", () => {
  const client = testClient(AuthenticationRoute);

  describe("signup", () => {
    it("should return 200 and the accessToken when successful", async () => {
      vi.mocked(signUp).mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        refreshTokenExpiresIn: Temporal.Duration.from({ minutes: 30 }),
      });

      const response = await client.signup.$post({
        json: { email: "test@test.io", password: "password" },
      });

      expect(response.status).toBe(201);

      const bodyResult = await response.json();

      expect(bodyResult).toMatchObject({
        accessToken: "access-token",
      });
      expect(response.headers.getSetCookie()).toEqual(
        expect.arrayContaining([expect.stringContaining("__Secure-refresh-token")]),
      );
    });
    it("should return 400 if the email is already taken", async () => {
      const client = testClient(AuthenticationRoute);

      vi.mocked(signUp).mockThrow(new EmailAlreadyTakenError());

      const response = await client.signup.$post({
        json: { email: "test@test.io", password: "password" },
      });

      expect(response.status).toBe(400);

      const bodyResult = await response.json();

      expect(bodyResult).toMatchObject({
        code: "EMAIL_ALREADY_TAKEN",
        message: "Email already taken.",
      });
    });
  });
});
