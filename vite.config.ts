import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode, command }) => {
  // Only VITE_-prefixed vars are inlined; anything else stays server-side.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    define,
    resolve: {
      // Vite 8 resolves tsconfig `paths` natively — no vite-tsconfig-paths needed.
      tsconfigPaths: true,
      alias: { "@": `${process.cwd()}/src` },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    build: {
      target: "es2022",
      cssTarget: "chrome111",
      sourcemap: false,
      reportCompressedSize: false,
    },
    server: { host: "::", port: 8080 },
    plugins: [
      tailwindcss(),
      tanstackStart({
        // Redirect TanStack Start's bundled server entry to src/server.ts
        // (our SSR error wrapper); nitro builds from this.
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      // Vercel is the deployment target, and the contact route's SMTP client
      // needs Node built-ins (net/tls) that the workerd runtime doesn't
      // provide — so local builds use the same preset as production rather
      // than a Cloudflare one that would fail differently.
      ...(command === "build" ? [nitro({ defaultPreset: "vercel" })] : []),
      viteReact(),
    ],
  };
});
