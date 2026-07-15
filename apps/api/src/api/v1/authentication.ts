import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  EmailAlreadyTakenError,
  InvalidRefreshTokenError,
  InvalidUsernameOrPasswordError,
} from "#app/authentication/errors.ts";
import { logIn } from "#app/authentication/log-in.ts";
import { logout } from "#app/authentication/log-out.ts";
import { refresh } from "#app/authentication/refresh.ts";
import { signUp } from "#app/authentication/sign-up.ts";

import {
  deleteRefreshTokenCookie,
  getRefreshTokenCookie,
  setRefreshTokenCookie,
} from "./authentication-helpers.ts";

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
          content: {
            "application/json": {
              schema: {
                accessToken: z.string(),
              },
            },
          },
        },
        400: {
          description: "Email already taken.",
        },
      },
    }),
    async (c) => {
      const { email, password } = c.req.valid("json");

      try {
        console.log("part1");
        const { accessToken, refreshToken, refreshTokenExpiresIn } = await signUp(email, password);
        console.log("part2");
        setRefreshTokenCookie(c, refreshToken, refreshTokenExpiresIn.total("seconds"));

        return c.json(
          {
            accessToken,
          },
          201,
        );
      } catch (ex) {
        console.log("here", ex);
        if (ex instanceof EmailAlreadyTakenError) {
          return c.json(
            {
              code: "EMAIL_ALREADY_TAKEN",
              message: "Email already taken.",
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
          content: {
            "application/json": {
              schema: {
                accessToken: z.string(),
              },
            },
          },
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

        setRefreshTokenCookie(c, refreshToken, refreshTokenExpiresIn.total("seconds"));

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
              code: "INVALID_USERNAME_OR_PASSWORD",
              message: "Invalid username or password.",
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
          content: {
            "application/json": {
              schema: {
                accessToken: z.string(),
              },
            },
          },
        },
        400: {
          description: "Invalid refresh token.",
        },
      },
    }),
    async (c) => {
      const prevRefreshToken = getRefreshTokenCookie(c);

      if (!prevRefreshToken) {
        return c.json(
          {
            code: "INVALID_REFRESH_TOKEN",
            message: "Invalid refresh token.",
          },
          400,
        );
      }

      try {
        const { accessToken, refreshToken, refreshTokenExpiresIn } =
          await refresh(prevRefreshToken);

        setRefreshTokenCookie(c, refreshToken, refreshTokenExpiresIn.total("seconds"));

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
              code: "INVALID_REFRESH_TOKEN",
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
      const refreshToken = getRefreshTokenCookie(c);
      console.log("refreshToken", refreshToken);
      if (refreshToken) {
        await logout(refreshToken);
      }

      deleteRefreshTokenCookie(c);

      return c.body(null, 204);
    },
  );
