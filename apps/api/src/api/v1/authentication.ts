import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

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
