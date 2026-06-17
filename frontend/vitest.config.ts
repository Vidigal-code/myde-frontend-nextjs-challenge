import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Configuração do Vitest — testes unitários de funções puras (sem DOM). */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    clearMocks: true,
  },
  resolve: {
    // Espelha os paths da arquitetura FSD definidos no tsconfig.
    alias: {
      "@/shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@/entities": fileURLToPath(new URL("./src/entities", import.meta.url)),
      "@/features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@/widgets": fileURLToPath(new URL("./src/widgets", import.meta.url)),
    },
  },
});
