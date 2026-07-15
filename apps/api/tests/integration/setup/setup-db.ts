import { MikroORM } from "@mikro-orm/postgresql";
import { Client } from "pg";

import MikroOrmConfig from "#src/mikro-orm.config.ts";

import { getDatabaseConfig } from "./db-config.ts";

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
