import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import svgLoader from "vite-svg-loader";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    const env = loadEnv(mode as string, process.cwd(), "");
    return {
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        plugins: [vue(), vueJsx(), vueDevTools(), svgLoader()],
        publicDir: "public",
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
                "vue3-recaptcha2": "vue3-recaptcha2",
            },
        },
        server: {
            port: parseInt(env.PORT as string) || 5000,
            proxy: {
                // 选项写法
                "/api": {
                    target: "http://127.0.0.1:8000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
            hmr: {
                overlay: false,
            },
            host: "0.0.0.0",
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/scss/_setting.scss";',
                },
            },
            modules: {
                localsConvention: "camelCaseOnly", // 使用駝峰命名法
            },
            postcss: {
                plugins: [tailwindcss()],
            },
        },
    };
});
