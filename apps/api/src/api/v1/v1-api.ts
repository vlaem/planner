import { OpenAPIHono } from "@hono/zod-openapi";
import { HealthRoute } from "./health.ts";
import { AuthenticationRoute } from "./authentication.ts";

export const v1App = new OpenAPIHono()
  .route("/health", HealthRoute)
  .route("/auth", AuthenticationRoute);

v1App.doc31("/docs", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Planner Api V1",
    description: "",
  },
});
