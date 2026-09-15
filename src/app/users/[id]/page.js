"use client";

import { Box, Typography, Container, CircularProgress, Paper, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserDetail = async () => {
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!user) return <Typography>User not found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          User Detail
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography>
          <strong>Username:</strong> {user.username}
        </Typography>
        <Typography>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography>
          <strong>Role:</strong> {user.role}
        </Typography>
        <Typography>
          <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
        </Typography>
      </Paper>
    </Container>
  );
}
