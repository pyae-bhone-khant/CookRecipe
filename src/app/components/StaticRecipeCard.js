"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";

/**
 * A reusable recipe card component for displaying static recipe data
 *
 * @param {Object} props
 * @param {Object} props.recipe - Recipe data object
 * @param {string} props.recipe.id - Recipe ID
 * @param {string} props.recipe.name - Recipe name/title
 * @param {string} props.recipe.image_url - Recipe image URL
 * @param {string} props.recipe.category - Recipe category
 * @param {Object} props.recipe.user - User who created the recipe
 * @param {number} props.recipe.rating - Recipe rating (optional)
 */
export default function StaticRecipeCard({ recipe }) {
  if (!recipe) return null;

  return (
    <Link
      href={`/recipes/${recipe.id}/view`}
      passHref
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          borderRadius: "16px",
          border: "3px solid transparent",
          transition: "all 0.5s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            borderColor: "#ff6f00",
            boxShadow: "0 4px 12px rgba(255, 111, 0, 0.9)",
          },
          cursor: "pointer",
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={recipe.image_url || "/images/food1.jpg"}
          alt={recipe.name || recipe.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" sx={{ fontWeight: "bold" }}>
            {recipe.name || recipe.title}
          </Typography>

          {/* Author and rating in one line */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              By {recipe.user?.username || recipe.author || "Unknown Chef"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StarIcon sx={{ color: "orange", fontSize: 16 }} />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {recipe.rating || 4.6}
              </Typography>
            </Box>
          </Box>

          {/* Category Chip */}
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip
              label={recipe.category}
              size="small"
              sx={{
                backgroundColor: "#fff3e0",
                color: "#ff6f00",
                textTransform: "capitalize",
              }}
            />
            {recipe.status && (
              <Chip
                label={recipe.status}
                size="small"
                color={recipe.status === "approve" ? "success" : "default"}
                sx={{ textTransform: "capitalize" }}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
}
