import { $, OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { v1App } from "./v1/v1-api.ts";

export const app = new OpenAPIHono()
  .use(
    "/*",
    cors({
      origin: "*",
      allowHeaders: ["Content-Type", "Authorization", "AnonymousId", "X-Request-Id"],
      allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE", "PUT"],
      exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .route("/api/v1", v1App)
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    return c.json({ error: "Internal server error" }, 500);
  });

app.get(
  "/scalar",
  Scalar({
    sources: [{ title: "V1", url: "/api/v1/docs" }],
  }),
);

app.get("/", (c) => {
  return c.redirect("/scalar");
});

export type AppType = typeof app;
