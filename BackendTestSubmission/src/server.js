import express from "express";
import cors from "cors";
import { sendLog } from "./logger.js";
import { nanoid } from "nanoid";

const app = express();
app.use(cors());
app.use(express.json());

const urlStore = new Map();

app.post("/shorturls", async (req, res) => {
  try {
    let { url, validity = 30, shortcode } = req.body;

    if (!url) {
      await sendLog("backend", "error", "shortener", "Missing URL in request");
      return res.status(400).json({ error: "URL is required" });
    }

    if (!shortcode) {
      shortcode = nanoid(6);
    }

    if (urlStore.has(shortcode)) {
      await sendLog("backend", "warn", "shortener", `Shortcode already exists: ${shortcode}`);
      return res.status(400).json({ error: "Shortcode already taken" });
    }

    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + validity * 60 * 1000);

    urlStore.set(shortcode, { url, createdAt, expiry, clicks: [] });

    await sendLog("backend", "info", "shortener", `Created ${shortcode} for ${url}`);

    res.status(201).json({
      shortUrl: `http://localhost:3000/${shortcode}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    await sendLog("backend", "error", "shortener", `Create failed: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const entry = urlStore.get(code);

    if (!entry) {
      await sendLog("backend", "error", "redirect", `Invalid code: ${code}`);
      return res.status(404).json({ error: "Shortcode not found" });
    }

    if (new Date() > entry.expiry) {
      await sendLog("backend", "warn", "redirect", `Expired code: ${code}`);
      return res.status(410).json({ error: "Link expired" });
    }

    entry.clicks.push({
      time: new Date().toISOString(),
      referrer: req.get("referer") || "direct",
      ip: req.ip,
    });

    await sendLog("backend", "info", "redirect", `Redirecting ${code} -> ${entry.url}`);
    res.redirect(entry.url);
  } catch (err) {
    await sendLog("backend", "error", "redirect", `Redirect error: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/shorturls/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const entry = urlStore.get(code);

    if (!entry) {
      await sendLog("backend", "error", "stats", `Stats requested for invalid: ${code}`);
      return res.status(404).json({ error: "Shortcode not found" });
    }

    const stats = {
      url: entry.url,
      createdAt: entry.createdAt,
      expiry: entry.expiry,
      totalClicks: entry.clicks.length,
      clicks: entry.clicks,
    };

    await sendLog("backend", "info", "stats", `Stats retrieved for ${code}`);
    res.json(stats);
  } catch (err) {
    await sendLog("backend", "error", "stats", `Stats error: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, async () => {
  await sendLog("backend", "info", "server", "Server started on port 3000");
  console.log("Server running on http://localhost:3000");
});
