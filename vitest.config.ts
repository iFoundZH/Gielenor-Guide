import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/data/**/*.ts"],
      exclude: [
        "src/**/__tests__/**",
        "src/**/*.d.ts",
      ],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
      reporter: ["text", "text-summary"],
    },
  },
});
