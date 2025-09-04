import axios from "axios";

let cachedToken = null;
const AUTH_URL = "http://20.244.56.144/evaluation-service/auth";

export async function getToken() {
  if (cachedToken) return cachedToken;
    try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/auth", {
      email: "22nm1a05c3@view.edu.in",
      name: "tejaswini",
      rollNo: "22nm1a05c3",
      accessCode: "YzuJeU",
      clientID: "17ac6087-67c9-41c2-ae36-f8424981ce12",
      clientSecret: "dVCPwxwzHVkmwuvA"
    });
    cachedToken = res.data.access_token;
    console.log("✅ Token fetched successfully");
    return cachedToken;
  } catch (err) {
    console.error(
      "❌ Failed to fetch token:",
      err.response?.status,
      err.response?.data || err.message
    );
    return null;
  }
}