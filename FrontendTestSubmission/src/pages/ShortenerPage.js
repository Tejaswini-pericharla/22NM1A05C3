import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, List, ListItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ShortenerPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [list, setList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const shortenUrl = async () => {
    if (!inputUrl.trim()) {
      setErrorMsg("Please enter a URL first");
      return;
    }
    if (list.length >= 5) {
      alert("You can only shorten 5 URLs at a time");
      return;
    }

    try {
      const resp = await axios.post("http://localhost:3000/shorturls", { url: inputUrl });
      setList([...list, resp.data]);
      setInputUrl("");
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>URL Shortener</Typography>
      <TextField
        label="Enter URL"
        fullWidth
        value={inputUrl}
        error={!!errorMsg}
        helperText={errorMsg}
        onChange={(e) => setInputUrl(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={shortenUrl}>
        Shorten
      </Button>

      <List sx={{ mt: 3 }}>
        {list.map((item, idx) => {
          const code = item.shortUrl.split("/").pop();
          return (
            <ListItem key={idx}>
              <Typography>
                <a href={item.shortUrl} target="_blank" rel="noreferrer">
                  {item.shortUrl}
                </a>
                {" | "}
                <Link to={`/stats/${code}`}>Stats</Link>
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}
