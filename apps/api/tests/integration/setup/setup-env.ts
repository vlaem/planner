import * as dotenvlocal from "dotenv-local";

import { getDatabaseConfig } from "./db-config.ts";

const env = dotenvlocal.loadEnv({
  envPrefix: "INTEGRATION_",
  envInitial: {
    INTEGRATION_POSTGRES_DB: "home_integration_tests",
    INTEGRATION_POSTGRES_HOST: "localhost",
    INTEGRATION_POSTGRES_PORT: "5432",
    INTEGRATION_POSTGRES_USER: "postgres",
    INTEGRATION_POSTGRES_PASSWORD: "postgres",
  },
});

for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}

const { connectionString } = getDatabaseConfig();

console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
console.log("connectionString", connectionString);
process.env.DATABASE_URL = connectionString;
console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
