import { useState } from "react";
import axios from "axios";

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // Create short URL
  const handleShorten = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setStats(null);
      const res = await axios.post("http://localhost:3000/shorturls", {
        url,
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    }
  };

  // Fetch stats for the short code
  const handleStats = async () => {
    if (!shortUrl) return;
    try {
      const code = shortUrl.split("/").pop();
      const res = await axios.get(`http://localhost:3000/shorturls/${code}`);
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch stats");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>🔗 URL Shortener</h1>

      {/* URL Input */}
      <form onSubmit={handleShorten}>
        <input
          type="text"
          placeholder="Enter a long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <button
          type="submit"
          style={{ marginLeft: "10px", padding: "8px 12px" }}
        >
          Shorten
        </button>
      </form>

      {/* Show Short URL */}
      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>
            ✅ Short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </p>
          <button onClick={handleStats} style={{ padding: "6px 10px" }}>
            Get Stats
          </button>
        </div>
      )}

      {/* Show Stats */}
      {stats && (
        <div style={{ marginTop: "20px" }}>
          <h3>📊 Stats</h3>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>⚠ {error}</p>
      )}
    </div>
  );
}
