"use client";

import { Box, Typography, Container, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleBackClick = () => {
    router.push('/home');
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Typography variant="body1" onClick={handleBackClick} sx={{ cursor: 'pointer', color: '#10B981' }}>
          ← Back
        </Typography>
      </Box>
      <Typography variant="h4" gutterBottom>
        {recipe.title}
      </Typography>
      <Typography variant="body1">
        Recipe detail page - Coming soon
      </Typography>
    </Container>
  );
}
