"use client";

import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import RecipeCardWithFavorite from "./RecipeCardWithFavorite";

export default function RecommendedRecipes({ recipes, favoriteRecipes, setFavoriteRecipes }) {
  const topRated = [...recipes]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" mt={7} mb={2}>
        Recommended Recipes
      </Typography>

      {topRated.length > 0 ? (
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={4}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={3000}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } }
          ]}
        >
          {topRated.map((recipe) => (
            <Box key={recipe.id} sx={{ px: 1, py: 2 }}>
              <RecipeCardWithFavorite
                recipe={recipe}
                isFavorite={favoriteRecipes.some((fav) => fav.id === recipe.id)}
                onToggleFavorite={(recipeId, isFavorite) => {
                  if (isFavorite) {
                    if (!favoriteRecipes.some((fav) => fav.id === recipeId)) {
                      const recipeToAdd = recipes.find((r) => r.id === recipeId);
                      if (recipeToAdd) {
                        setFavoriteRecipes((prev) => [...prev, recipeToAdd]);
                      }
                    }
                  } else {
                    setFavoriteRecipes((prev) => prev.filter((r) => r.id !== recipeId));
                  }
                }}
              />
            </Box>
          ))}
        </Slider>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1">No recommended recipes available.</Typography>
        </Box>
      )}
    </Box>
  );
}
