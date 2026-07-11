import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";

import {
  EmailAlreadyTakenError,
  InvalidRefreshTokenError,
  InvalidUsernameOrPasswordError,
} from "#app/authentication/errors.ts";
import { logIn } from "#app/authentication/log-in.ts";
import { logout } from "#app/authentication/log-out.ts";
import { refresh } from "#app/authentication/refresh.ts";
import { signUp } from "#app/authentication/sign-up.ts";

const REFRESH_COOKIE_NAME = "__Secure-refresh-token";

export const AuthenticationRoute = new OpenAPIHono()
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "signup",
      request: {
        body: {
          required: true,
          description: "Signup",
          content: {
            "application/json": {
              schema: z.object({
                email: z.email().toLowerCase().trim(),
                password: z.string().min(8),
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: "Signup successful.",
        },
        400: {
          description: "Email already taken.",
        },
      },
    }),
    async (c) => {
      const { email, password } = c.req.valid("json");

      try {
        const { accessToken, refreshToken, refreshTokenExpiresIn } = await signUp(email, password);

        setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          path: "/v1/auth",
          maxAge: Math.trunc(refreshTokenExpiresIn.milliseconds / 1000),
        });

        return c.json(
          {
            accessToken,
          },
          201,
        );
      } catch (ex) {
        if (ex instanceof EmailAlreadyTakenError) {
          return c.json(
            {
              code: ex.code,
              message: ex.message,
            },
            400,
          );
        }

        throw ex;
      }
    },
  )
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "login",
      request: {
        body: {
          required: true,
          description: "Login",
          content: {
            "application/json": {
              schema: z.object({
                email: z.email().toLowerCase().trim(),
                password: z.string().min(8),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
        },
        400: {
          description: "Invalid username or password.",
        },
      },
    }),
    async (c) => {
      const { email, password } = c.req.valid("json");
      try {
        const { accessToken, refreshToken, refreshTokenExpiresIn } = await logIn(email, password);
        setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          path: "/v1/auth",
          maxAge: Math.trunc(refreshTokenExpiresIn.milliseconds / 1000),
        });

        return c.json(
          {
            accessToken,
          },
          200,
        );
      } catch (ex) {
        if (ex instanceof InvalidUsernameOrPasswordError) {
          return c.json(
            {
              code: ex.code,
              message: ex.message,
            },
            400,
          );
        }

        throw ex;
      }
    },
  )
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "refresh",
      responses: {
        200: {
          description: "Refresh successful.",
        },
      },
    }),
    async (c) => {
      const prevRefreshToken = getCookie(c, "__Host-refresh-token");

      if (!prevRefreshToken) {
        return c.json(
          {
            message: "Invalid refresh token.",
          },
          400,
        );
      }

      try {
        const { accessToken, refreshToken, refreshTokenExpiresIn } =
          await refresh(prevRefreshToken);

        setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          path: "/v1/auth",
          maxAge: Math.trunc(refreshTokenExpiresIn.milliseconds / 1000),
        });

        return c.json(
          {
            accessToken,
          },
          200,
        );
      } catch (ex) {
        if (ex instanceof InvalidRefreshTokenError) {
          return c.json(
            {
              message: "Invalid refresh token.",
            },
            400,
          );
        }

        throw ex;
      }
    },
  )
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "logout",
      responses: {
        204: {
          description: "Logout successful.",
        },
      },
    }),
    async (c) => {
      const refreshToken = getCookie(c, REFRESH_COOKIE_NAME);

      if (refreshToken) {
        await logout(refreshToken);
      }

      deleteCookie(c, REFRESH_COOKIE_NAME, {
        secure: true,
        path: "/v1/auth",
      });

      return c.body(null, 204);
    },
  );
