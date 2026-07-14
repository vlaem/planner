import { MikroORM } from "@mikro-orm/postgresql";
import { Client } from "pg";

import MikroOrmConfig from "../../../src/mikro-orm.config.ts";

function getDatabaseConfig() {
  const name = process.env.INTEGRATION_POSTGRES_DB;
  const host = process.env.INTEGRATION_POSTGRES_HOST;
  const port = process.env.INTEGRATION_POSTGRES_PORT;
  const user = process.env.INTEGRATION_POSTGRES_USER;
  const password = process.env.INTEGRATION_POSTGRES_PASSWORD;
  const connectionString = `postgres://${user}:${password}@${host}:${port}/${name}`;
  const connectionStringWithoutDb = `postgres://${user}:${password}@${host}:${port}/postgres`;

  return {
    name,
    port,
    user,
    password,
    connectionString,
    connectionStringWithoutDb,
  };
}

export async function setupDb();

const { name: databaseName, connectionString, connectionStringWithoutDb } = getDatabaseConfig();

const client = new Client({
  connectionString: connectionStringWithoutDb,
});
await client.connect();
await client.query(
  `
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1
      AND pid <> pg_backend_pid();
  `,
  [databaseName],
);
await client.query(`DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`);
await client.query(`CREATE DATABASE "${databaseName}"`);
await client.end();

const orm = await MikroORM.init({
  ...MikroOrmConfig,
  clientUrl: connectionString,
  allowGlobalContext: true,
});

const generator = orm.schema;

await generator.refresh();
await orm.close();
