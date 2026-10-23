import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { app } from "./src/server/app";

const PORT = 3000;

async function startServer() {
  // Setup Vite SPA dev server middleware for local development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Standalone local development listener (do not call on Vercel serverless)
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`KINGSMAN Dev Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();
