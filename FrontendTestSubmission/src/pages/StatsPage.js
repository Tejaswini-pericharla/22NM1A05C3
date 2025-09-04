import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

function StatsPage() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/shorturls/${code}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setStats(null);
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        {stats ? (
          <>
            <Typography variant="h5" gutterBottom>
              Stats for <b>{code}</b>
            </Typography>
            <Typography>Original URL: {stats.url}</Typography>
            <Typography>Created At: {new Date(stats.createdAt).toLocaleString()}</Typography>
            <Typography>Expiry: {new Date(stats.expiry).toLocaleString()}</Typography>
            <Typography>Total Clicks: {stats.totalClicks}</Typography>

            {stats.clicks && stats.clicks.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6">Click Details</Typography>
                <Paper sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Referrer</TableCell>
                        <TableCell>IP</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.clicks.map((c, i) => (
                        <TableRow key={i}>
                          <TableCell>{new Date(c.time).toLocaleString()}</TableCell>
                          <TableCell>{c.referrer || "Direct"}</TableCell>
                          <TableCell>{c.ip || "Unknown"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="h6">No stats found for {code}</Typography>
        )}
      </Box>
    </Container>
  );
}

export default StatsPage;
