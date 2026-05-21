"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  CardActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

/**
 * An enhanced recipe card component with favorite functionality
 *
 * @param {Object} props
 * @param {Object} props.recipe - Recipe data object
 * @param {string} props.recipe.id - Recipe ID
 * @param {string} props.recipe.name - Recipe name/title
 * @param {string} props.recipe.image_url - Recipe image URL
 * @param {string} props.recipe.category - Recipe category
 * @param {Object} props.recipe.user - User who created the recipe
 * @param {number} props.recipe.average_rating - Recipe rating (optional)
 * @param {boolean} props.isFavorite - Whether the recipe is favorited
 * @param {Function} props.onToggleFavorite - Function to toggle favorite status
 */
export default function RecipeCardWithFavorite({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onDelete,
}) {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [rating, setRating] = useState(0);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    if (recipe.ratings && recipe.ratings.length > 0) {
      const total = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
      const avg = total / recipe.ratings.length;
      setRating(avg.toFixed(1)); // One decimal place
    } else {
      setRating(0);
    }
  }, [recipe.ratings]);

  if (!recipe) return null;

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (!session?.user?.id || isProcessing) return;

    setIsProcessing(true);

    try {
      let response;

      if (!favorite) {
        // Add to favorites
        response = await fetch('/api/favourites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: session.user.id,
            recipe_id: recipe.id
          }),
        });
      } else {
        // Remove from favorites
        response = await fetch(`/api/favourites/delete?userId=${session.user.id}&recipeId=${recipe.id}`, {
          method: 'DELETE',
        });
      }

      if (response.ok) {
        const newFavoriteState = !favorite;
        setFavorite(newFavoriteState);
        if (onToggleFavorite) {
          onToggleFavorite(recipe.id, newFavoriteState);
        }
      } else {
        console.error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

    useEffect(() => {
      // Get average rating
      axios
        .get(`/api/ratings/average?recipeId=${recipe.id}`)
        .then((res) => setAverage(res.data.average || 0))
        .catch((err) => console.error("Average rating error", err));
    }, [recipe.id]);

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Link
        href={`/recipes/${recipe.id}/view`}
        passHref
        style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex", flexDirection: "column" }}
      >
        <CardMedia
          component="img"
          height="180"
          image={recipe.image_url || "/images/food1.jpg"}
          alt={recipe.name || recipe.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flex: 1 }}>
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
              <StarIcon sx={{ color: "#FFB000", fontSize: 18}} />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {average}/5
              </Typography>
            </Box>
          </Box>

          {/* Category Chip and Favorite Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              width: "100%"
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={recipe?.category?.name}
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 118, 34, 0.08)",
                  color: "primary.main",
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
              />
              {recipe.status && recipe.status === "pending" && (
                <Chip
                  label={recipe.status}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              )}
              {recipe.status && recipe.status === "reject" && (
                <Chip
                  label={recipe.status}
                  size="small"
                  color={recipe.status === "reject" ? "error" : "default"}
                  sx={{ textTransform: "capitalize" }}
                />
              )}

            </Box>

            {/* Favorite button */}
            <IconButton
              onClick={handleToggleFavorite}
              disabled={isProcessing || !session}
              size="small"
              sx={{
                color: favorite ? 'secondary.main' : 'rgba(0, 0, 0, 0.38)',
                '&:hover': {
                  color: favorite ? 'secondary.main' : 'primary.main',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
                padding: 0.5
              }}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>


          </Box>
        </CardContent>
      </Link>

      {/* delete */}
      {/* {onDelete && (
              <IconButton
                onClick={() => onDelete(recipe.id)}
                color="error"
                title="Delete Recipe"
              >
                <DeleteIcon />
              </IconButton>
            )} */}

      {onDelete && (
        <IconButton
          onClick={() => onDelete(recipe.id)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            border: "2px solid #ff7f00",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            "&:hover": {
              backgroundColor: "#ff7f00",
              color: "#d32f2f",
            },
            zIndex: 10,
          }}
          size="small"
          title="Delete Recipe"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}

    </Card>
  );
}
