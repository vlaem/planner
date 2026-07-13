import { testClient } from "hono/testing";
import { describe, expect, it, vi } from "vitest";

import {
  EmailAlreadyTakenError,
  InvalidUsernameOrPasswordError,
} from "#app/authentication/errors.ts";
import { logIn } from "#app/authentication/log-in.ts";
import { signUp } from "#app/authentication/sign-up.ts";

import { AuthenticationRoute } from "./authentication.ts";

vi.mock("#app/authentication/sign-up.ts");
vi.mock("#app/authentication/log-in.ts");

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
  describe("login", () => {
    it("should return 200 and the accessToken when successful", async () => {
      vi.mocked(logIn).mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        refreshTokenExpiresIn: Temporal.Duration.from({ minutes: 30 }),
      });

      const response = await client.login.$post({
        json: { email: "test@test.io", password: "password" },
      });

      expect(response.status).toBe(200);

      const bodyResult = await response.json();

      expect(bodyResult).toMatchObject({
        accessToken: "access-token",
      });
      expect(response.headers.getSetCookie()).toEqual(
        expect.arrayContaining([expect.stringContaining("__Secure-refresh-token")]),
      );
    });
    it("should return 400 if the username or password is invalid", async () => {
      vi.mocked(logIn).mockThrow(new InvalidUsernameOrPasswordError());

      const response = await client.login.$post({
        json: { email: "test@test.io", password: "password" },
      });

      expect(response.status).toBe(400);

      const bodyResult = await response.json();

      expect(bodyResult).toMatchObject({
        code: "INVALID_USERNAME_OR_PASSWORD",
        message: "Invalid username or password.",
      });
    });
  });
});
