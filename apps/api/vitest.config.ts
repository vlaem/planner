import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit-tests",
          environment: "node",
          include: ["src/**/*.spec.ts"],
          setupFiles: ["./tests/unit/setup.ts"],
          env: {
            NODE_ENV: "test",
            DATABASE_URL: "//mock:mock@localhost:5432/mock_db",
          },
        },
      },
      {
        test: {
          name: "integration-tests",
          environment: "node",
          include: ["tests/integration/*.spec.ts"],
          globalSetup: ["./tests/integration/setup/global-setup.ts"],
          setupFiles: ["./tests/integration/setup/setup.ts"],
        },
      },
    ],
  },
});
