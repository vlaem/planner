import { testClient } from "hono/testing";
import { describe, expect, it, vi } from "vitest";

import {
  EmailAlreadyTakenError,
  InvalidRefreshTokenError,
  InvalidUsernameOrPasswordError,
} from "#app/authentication/errors.ts";
import { logIn } from "#app/authentication/log-in.ts";
import { logout } from "#app/authentication/log-out.ts";
import { refresh } from "#app/authentication/refresh.ts";
import { signUp } from "#app/authentication/sign-up.ts";

import { AuthenticationRoute } from "./authentication.ts";

vi.mock("#app/authentication/sign-up.ts");
vi.mock("#app/authentication/log-in.ts");
vi.mock("#app/authentication/refresh.ts");
vi.mock("#app/authentication/log-out.ts");

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
  describe("refresh", () => {
    const cookie = "__Secure-refresh-token=refresh-token";

    it("should return 200, the new access token, and rotate the refresh token", async () => {
      vi.mocked(refresh).mockResolvedValueOnce({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        refreshTokenExpiresIn: Temporal.Duration.from({ minutes: 30 }),
      });

      const response = await client.refresh.$post(
        {},
        {
          headers: {
            Cookie: cookie,
          },
        },
      );

      expect(response.status).toBe(200);

      expect(await response.json()).toMatchObject({
        accessToken: "new-access-token",
      });

      expect(refresh).toHaveBeenCalledOnce();
      expect(refresh).toHaveBeenCalledWith("refresh-token");

      expect(response.headers.getSetCookie()).toEqual(
        expect.arrayContaining([
          expect.stringContaining("__Secure-refresh-token=new-refresh-token"),
        ]),
      );

      vi.mocked(refresh).mockClear();
    });

    it("should return 400 when the refresh token cookie is missing", async () => {
      const response = await client.refresh.$post({
        headers: {},
      });

      expect(response.status).toBe(400);

      expect(await response.json()).toMatchObject({
        code: "INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token.",
      });

      expect(refresh).not.toHaveBeenCalled();
    });

    it("should return 400 when the refresh token is invalid", async () => {
      vi.mocked(refresh).mockRejectedValue(new InvalidRefreshTokenError());

      const response = await client.refresh.$post(
        {},
        {
          headers: {
            Cookie: cookie,
          },
        },
      );

      expect(response.status).toBe(400);

      expect(await response.json()).toMatchObject({
        message: "Invalid refresh token.",
      });

      expect(refresh).toHaveBeenCalledWith("refresh-token");
    });
  });
  describe("logout", () => {
    const cookie = "__Secure-refresh-token=refresh-token";

    it("should invalidate the refresh token and delete the cookie", async () => {
      vi.mocked(logout).mockResolvedValue(undefined);

      const response = await client.logout.$post(
        {},
        {
          headers: {
            Cookie: cookie,
          },
        },
      );

      expect(response.status).toBe(204);
      expect(await response.text()).toBe("");

      expect(logout).toHaveBeenCalledOnce();
      expect(logout).toHaveBeenCalledWith("refresh-token");

      const setCookies = response.headers.getSetCookie();

      expect(setCookies).toEqual(
        expect.arrayContaining([expect.stringContaining("__Secure-refresh-token=")]),
      );
      vi.mocked(logout).mockClear();
    });

    it("should still return 204 when no refresh token cookie exists", async () => {
      const response = await client.logout.$post({});

      expect(response.status).toBe(204);
      expect(logout).not.toHaveBeenCalled();

      // The route still calls deleteRefreshTokenCookie().
      expect(response.headers.getSetCookie()).toEqual(
        expect.arrayContaining([expect.stringContaining("__Secure-refresh-token=")]),
      );
    });
  });
});
