import "temporal-polyfill/global";
import "./setup-env.ts";
import "./setup-db.ts";
import type { AddressInfo } from "node:net";

import { serve } from "@hono/node-server";

import { app } from "#api/app.ts";
import { orm } from "#infra/db/mikro-orm.ts";

export default async function setup() {
  const server = serve({
    fetch: app.fetch,
    port: 3000,
  });

  const port = (server.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;
  process.env.INTEGRATION_TESTS_BASE_URL = baseUrl;

  return async () => {
    server.close();
    await orm.close();
  };
}
