import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "ES2020",
  },
  optimizeDeps: {
    exclude: ["@wasm-fmt/clang-format"],
  },
});
