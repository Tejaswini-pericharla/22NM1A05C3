import axios from "axios";
import { getToken } from "./auth.js";

const LOG_API = "http://20.244.56.144/evaluation-service/logs";

export async function Log(stack, level, pkg, message) {
  try {
    const token = (await getToken())?.trim();

    // Offline testing mode
    if (!token) {
      console.log(`[${stack}] [${level}] [${pkg}] ${message}`);
      return;
    }

    const payload = {
      stack,
      level,
      package: pkg,
      message,
      timestamp: new Date().toISOString(),
    };

    const res = await axios.post(LOG_API, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Log sent:", res.data);
  } catch (err) {
    console.error("⚠️ Logging failed:", err.response?.data || err.message);
  }
}
