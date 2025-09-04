import express from "express";
import { Log } from "./middleware/logger.js";

const app = express();

app.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Home route accessed");
  res.send("Hello, backend is running!");
});

const PORT = 3000;
app.listen(PORT, async () => {
  // Fire-and-forget logging
  Log("backend", "info", "server", `Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
