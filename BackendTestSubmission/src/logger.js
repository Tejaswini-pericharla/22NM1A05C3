import axios from "axios";
import { fetchAuthToken } from "./auth.js";

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

export async function sendLog(stack, level, pkg, msg) {
  try {
    const token = await fetchAuthToken();
    if (!token) {
      console.error("Missing token, cannot log");
      return null;
    }

    const data = {
      stack,
      level,
      package: pkg,
      message: msg,
      timestamp: new Date().toISOString(),
    };

    const response = await axios.post(LOG_ENDPOINT, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Log sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Logging failed:", error?.response?.data || error.message);
    return null;
  }
}
