import express from "express";
import cors from "cors";
import { Log } from "./logger.js";
import { nanoid } from "nanoid";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store (replace with DB later if needed)
const urlStore = new Map(); // { shortcode: { url, createdAt, expiry, clicks: [] } }

// ===============================
// 🔹 Create Short URL
// ===============================
app.post("/shorturls", async (req, res) => {
  try {
    let { url, validity = 30, shortcode } = req.body;

    if (!url) {
      await Log("backend", "error", "shortener", "Missing URL in request");
      return res.status(400).json({ error: "URL is required" });
    }

    if (!shortcode) shortcode = nanoid(6);
    if (urlStore.has(shortcode)) {
      await Log("backend", "warn", "shortener", `Shortcode exists: ${shortcode}`);
      return res.status(400).json({ error: "Shortcode already exists" });
    }

    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + validity * 60000);

    urlStore.set(shortcode, { url, createdAt, expiry, clicks: [] });

    await Log("backend", "info", "shortener", `Short URL created for ${url} as ${shortcode}`);

    res.status(201).json({
      shortUrl: `http://localhost:3000/${shortcode}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    await Log("backend", "error", "shortener", `Error creating URL: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ===============================
// 🔹 Redirect
// ===============================
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const entry = urlStore.get(code);

    if (!entry) {
      await Log("backend", "error", "redirect", `Invalid shortcode: ${code}`);
      return res.status(404).json({ error: "Shortcode not found" });
    }

    if (new Date() > entry.expiry) {
      await Log("backend", "warn", "redirect", `Expired shortcode: ${code}`);
      return res.status(410).json({ error: "Link expired" });
    }

    entry.clicks.push({
      timestamp: new Date().toISOString(),
      referrer: req.get("referer") || "direct",
      ip: req.ip,
    });

    await Log("backend", "info", "redirect", `Redirecting ${code} → ${entry.url}`);
    res.redirect(entry.url);
  } catch (err) {
    await Log("backend", "error", "redirect", `Redirect failed: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ===============================
// 🔹 Get Stats
// ===============================
app.get("/shorturls/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const entry = urlStore.get(code);

    if (!entry) {
      await Log("backend", "error", "stats", `Stats requested for invalid: ${code}`);
      return res.status(404).json({ error: "Shortcode not found" });
    }

    const stats = {
      totalClicks: entry.clicks.length,
      originalUrl: entry.url,
      createdAt: entry.createdAt,
      expiry: entry.expiry,
      clicks: entry.clicks,
    };

    await Log("backend", "info", "stats", `Stats retrieved for ${code}`);
    res.json(stats);
  } catch (err) {
    await Log("backend", "error", "stats", `Error retrieving stats: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ===============================
// 🔹 Start server
// ===============================
app.listen(3000, async () => {
  await Log("backend", "info", "server", "URL Shortener running on port 3000");
  console.log("🚀 Server running on http://localhost:3000");
});
