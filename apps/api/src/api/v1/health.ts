import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

export const HealthRoute = new OpenAPIHono().openapi(
  createRoute({
    tags: ["Health"],
    method: "get",
    path: "/",
    security: [],
    responses: {
      200: {
        description: "Service is healthy",
      },
    },
  }),
  async (c) => {
    return c.json({ status: "ok" }, 200);
  },
);
