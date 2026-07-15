import "temporal-polyfill/global";
import { Migrator } from "@mikro-orm/migrations";
import type { Options } from "@mikro-orm/postgresql";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

const config: Partial<Options> = {
  entitiesTs: ["./src/infra/db/schemas/*.schema.ts"],
  driver: PostgreSqlDriver,
  discovery: {
    warnWhenNoEntities: false,
  },
  migrations: {
    pathTs: "./src/infra/db/migrations",
  },
  clientUrl: process.env.DATABASE_URL,
  extensions: [Migrator],
  dynamicImportProvider: (id) => import(id),
};

if (process.env.VITEST_DUMMY_OUT_CN === "true") {
  config.dbName = "dummy";
  config.clientUrl = undefined;
}

export default config;
