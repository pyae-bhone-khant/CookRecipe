"use client";

import { Box, Typography, Container, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPage({ params }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${params.id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6">Recipe not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Recipe: {recipe.title}
      </Typography>
      <Typography variant="body1">
        Recipe edit page - Coming soon
      </Typography>
    </Container>
  );
}
