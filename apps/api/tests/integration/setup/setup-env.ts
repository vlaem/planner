import * as dotenvlocal from "dotenv-local";

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
