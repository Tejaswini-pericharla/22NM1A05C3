import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let cachedToken = null;

export async function getToken() {
  if (cachedToken) return cachedToken;
  try {
    const res = await axios.post(process.env.AUTH_URL, {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLLNO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    cachedToken = res.data.access_token;
    console.log("✅ Token fetched:", cachedToken);
    return cachedToken;
  } catch (err) {
    console.error("❌ Auth failed:", err.response?.data || err.message);
    return null;
  }
}
