import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(
        env.VITE_SUPABASE_PROJECT_ID || "dtihbwqrjsvigtautuxr",
      ),
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        env.VITE_SUPABASE_URL || "https://dtihbwqrjsvigtautuxr.supabase.co",
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aWhid3FyanN2aWd0YXV0dXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTY5MzksImV4cCI6MjA4OTQzMjkzOX0.J2PfPZ_l05FeGYCJgyQbGOxJjahM5rSlfW9m10qMsmA",
      ),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
