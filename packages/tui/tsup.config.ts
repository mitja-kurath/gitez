import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  splitting: false,
  shims: true,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      ".tsx": "tsx",
      ".ts": "ts"
    };
  }
});