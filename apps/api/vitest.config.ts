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
          },
        },
      },
    ],
  },
});
