import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  splitting: false,
  shims: true
  // No banner here; we keep the shebang in source
});