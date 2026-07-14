import * as dotenvlocal from "dotenv-local";

export function setup() {
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

  console.log("process.env.TEST_VAR", process.env.TEST_VAR);
}

export function teardown() {
  console.log("teardown");
}
