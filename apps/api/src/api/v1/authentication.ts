import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";

import { EmailAlreadyTakenError } from "#app/authentication/errors.ts";
import { signUp } from "#app/authentication/sign-up.ts";

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
        500: {
          description: "Not Implemented",
        },
      },
    }),
    async (c) => {
      const { email, password } = c.req.valid("json");

      try {
        const { accessToken, refreshToken, refreshTokenExpiresIn } = await signUp(email, password);

        setCookie(c, "__Host-refresh-token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          path: "/",
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
                email: z.email().trim(),
                password: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        500: {
          description: "Not Implemented",
        },
      },
    }),
    async (c) => {
      return c.json(
        {
          message: "Not Implemented",
        },
        500,
      );
    },
  )
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "refresh",
      request: {
        body: {
          required: true,
          description: "Refresh",
          content: {
            "application/json": {
              schema: z.object({
                refreshToken: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        500: {
          description: "Not Implemented",
        },
      },
    }),
    async (c) => {
      return c.json(
        {
          message: "Not Implemented",
        },
        500,
      );
    },
  )
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "logout",
      request: {
        body: {
          required: true,
          description: "Logout",
          content: {
            "application/json": {
              schema: z.object({
                refreshToken: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        500: {
          description: "Not Implemented",
        },
      },
    }),
    async (c) => {
      return c.json(
        {
          message: "Not Implemented",
        },
        500,
      );
    },
  );
