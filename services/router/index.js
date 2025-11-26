import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Backend service URLs (Cloud Run URLs or custom domains)
const WEB_URL = process.env.WEB_URL;
const API_URL = process.env.API_URL;
const AGENTS_URL = process.env.AGENTS_URL;
const DREAMKEEPER_URL = process.env.DREAMKEEPER_URL;

if (!WEB_URL || !API_URL || !AGENTS_URL || !DREAMKEEPER_URL) {
  console.error("Missing required backend URLs in env");
}

function makeProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    // Preserve paths
    pathRewrite: (path) => path,
    onProxyReq(proxyReq, req, res) {
      // Optional: add headers for tracing
      proxyReq.setHeader("x-dreamnet-router", "true");
    }
  });
}

// API paths
app.use("/api", makeProxy(API_URL));

// Agents
app.use("/agents", makeProxy(AGENTS_URL));

// Dreamkeeper
app.use("/dreamkeeper", makeProxy(DREAMKEEPER_URL));

// Everything else → web
app.use("/", makeProxy(WEB_URL));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`DreamNet router listening on port ${port}`);
});

