import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let tokenCache = null;

export async function fetchAuthToken() {
  if (tokenCache) {
    return tokenCache;
  }

  try {
    const response = await axios.post(process.env.AUTH_URL, {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLLNO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    const tokenFromServer = response?.data?.access_token;
    tokenCache = tokenFromServer;
    console.log("Got new auth token:", tokenCache);
    return tokenCache;
  } catch (error) {
    console.error("Auth request failed:", error?.response?.data || error.message);
    return null;
  }
}
