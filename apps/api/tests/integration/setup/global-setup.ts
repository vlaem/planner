import "temporal-polyfill/global";
import "./setup-env.ts";
import type { AddressInfo } from "node:net";

import { serve } from "@hono/node-server";
import type { TestProject } from "vitest/node";

import { app } from "#api/app.ts";
import { orm } from "#infra/db/mikro-orm.ts";

export default async function setup(project: TestProject) {
  await orm.schema.ensureDatabase();
  await orm.schema.refresh();

  const server = serve({
    fetch: app.fetch,
    port: 3000,
  });

  const port = (server.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  process.env.INTEGRATION_TESTS_BASE_URL = baseUrl;

  project.onTestsRerun(async () => {
    await orm.schema.refresh();
  });

  return async () => {
    server.close();
    await orm.close();
  };
}
