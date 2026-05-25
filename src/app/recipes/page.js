"use client";

import {
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import TrendingSlider from "../components/TrendingSlider";
import RecipeCardWithFavorite from "../components/RecipeCardWithFavorite";
import SearchBar from "../components/SearchBar";
import RecommendedRecipes from "../components/RecommendedRecipes";
import Footer from "../components/Footer";

const PAGE_SIZE = 12;

export default function Recipe() {
  const { data: session } = useSession();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams({
        page: String(currentPage),
        limit: String(PAGE_SIZE),
      });

      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery) {
        query.set("search", trimmedQuery);
      }

      const response = await fetch(`/api/recipes?${query.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();

      const transformedRecipes = (data.recipes || []).map((recipe) => ({
        ...recipe,
        title: recipe.name,
        author: recipe.user?.username || "Unknown Chef",
        image: recipe.image_url,
        rating: recipe.averageRating || 0,
      }));

      setRecipes(transformedRecipes);
      setPagination(data.pagination || { page: currentPage, totalPages: 1, total: 0 });
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.message);
      setRecipes([]);
      setPagination({ page: currentPage, totalPages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteRecipes = async () => {
    if (!session?.user?.id) {
      setFavoriteRecipes([]);
      return;
    }

    try {
      const response = await fetch(`/api/favourites/user?userId=${session.user.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch favorite recipes");
      }

      const data = await response.json();
      setFavoriteRecipes(data);
    } catch (err) {
      console.error("Error fetching favorite recipes:", err);
      setFavoriteRecipes([]);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [session, currentPage, searchQuery]);

  useEffect(() => {
    fetchFavoriteRecipes();
  }, [session]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <Box>
      <Navbar />

      <Box sx={{ pt: { xs: 2, md: 4 }, pl: { xs: 2, sm: 3, md: 5 }, pr: { xs: 2, sm: 3, md: 0 }, maxWidth: "1200px", mx: "auto" }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <TrendingSlider />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 3, md: 5 } }}>
          <SearchBar onSearch={handleSearch} />
        </Box>

        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          All Recipes
        </Typography>

        <Box flex={1}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#10B981" }} />
              <Typography sx={{ ml: 2, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                Loading delicious recipes...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && (
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                {session?.user?.id
                  ? `Welcome back, ${session.user.name || session.user.username}! Showing recipes from our community.`
                  : "Showing sample recipes. Log in to see more recipes from our community!"}
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: 4 }}>
            {recipes.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(auto-fill, minmax(150px, 1fr))",
                    sm: "repeat(auto-fill, minmax(200px, 1fr))",
                    md: "repeat(auto-fill, minmax(280px, 1fr))",
                  },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                {recipes.map((recipe) => (
                  <RecipeCardWithFavorite
                    key={recipe.id}
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
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1">No recipes found for this search.</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.max(pagination.totalPages, 1)}
              page={pagination.page || currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                },
                "& .Mui-selected": {
                  backgroundColor: "#10B981",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#059669",
                  },
                },
              }}
            />
          </Box>
        </Box>

        <RecommendedRecipes recipes={recipes} favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} />
      </Box>

      <Footer />
    </Box>
  );
}
