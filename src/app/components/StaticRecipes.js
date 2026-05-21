"use client";

import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import StaticRecipeCard from "./StaticRecipeCard";

/**
 * A component to display a grid of static recipe cards
 *
 * @param {Object} props
 * @param {Array} props.recipes - Array of recipe objects
 * @param {string} props.title - Section title (optional)
 * @param {string} props.subtitle - Section subtitle (optional)
 */
export default function StaticRecipes({ recipes, title, subtitle }) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {title && (
        <Typography variant="h5" fontWeight="bold" mb={subtitle ? 1 : 3}>
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography variant="body1" color="text.secondary" mb={3}>
          {subtitle}
        </Typography>
      )}

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
            <StaticRecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
