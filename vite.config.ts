import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
        dts: "src/auto-imports.d.ts",
      }),
      Components({
        dts: "src/components.d.ts",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 3000,
      open: true,
      // 配置代理 - 代理所有 /api 开头的请求到后端
      proxy: {
        [env.VITE_API_PREFIX || "/api"]: {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          // 移除 /api 前缀转发到后端
          rewrite: (path) =>
            path.replace(new RegExp(`^${env.VITE_API_PREFIX || "/api"}`), ""),
        },
      },
    },
    build: {
      target: "esnext",
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            framework: ["vue", "vue-router", "pinia"],
            http: ["axios"],
          },
        },
      },
      esbuild: {
        drop: ["console", "debugger"],
      },
    },
  };
});
