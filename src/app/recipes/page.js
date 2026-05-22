"use client";

import {
  Typography,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  InputAdornment,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Navbar from "../components/Navbar";
import TrendingSlider from "../components/TrendingSlider";
import RecipeCardWithFavorite from "../components/RecipeCardWithFavorite";
import SearchBar from "../components/SearchBar";
import RecommendedRecipes from "../components/RecommendedRecipes";
import Footer from "../components/Footer";

export default function Recipe() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Database recipe states
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Empty fallback for recipes
  const emptyRecipes = [];

  // Favorite recipes state
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recipes?includeRatings=true');

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();

      const transformedRecipes = data.recipes.map(recipe => ({
        ...recipe,
        title: recipe.name,
        author: recipe.user?.username || 'Unknown Chef',
        image: recipe.image_url,
        rating: recipe.averageRating || 0 // Use actual average rating from database
      }));

      setRecipes(transformedRecipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
      setRecipes(emptyRecipes);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite recipes
  const fetchFavoriteRecipes = async () => {
    if (!session?.user?.id) {
      setFavoriteRecipes([]);
      return;
    }

    try {
      const response = await fetch(`/api/favourites/user?userId=${session.user.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch favorite recipes');
      }

      const data = await response.json();
      // console.log('Fetched favorite recipes:', data);
      setFavoriteRecipes(data);
    } catch (err) {
      console.error('Error fetching favorite recipes:', err);
      setFavoriteRecipes([]);
    }
  };

  // Fetch recipes when component mounts or session changes
  useEffect(() => {
    fetchRecipes();
    fetchFavoriteRecipes();
  }, [session]);


  //  state 
  const [searchQuery, setSearchQuery] = useState("");

  //  getFilteredRecipes function and search filtering 
  const getFilteredRecipes = () => {
    const filteredByCategory = selectedCategory === "All"
      ? recipes
      : recipes.filter(recipe =>
        recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

    if (!searchQuery.trim()) return filteredByCategory;

    return filteredByCategory.filter(recipe =>
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Box>
      <Navbar />

      <Box sx={{ pt: { xs: 2, md: 4 }, pl: { xs: 2, sm: 3, md: 5 }, pr: { xs: 2, sm: 3, md: 0 }, maxWidth: "1200px", mx: "auto" }}>
        {/* Header Banner - Hide on mobile */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TrendingSlider />
        </Box>

        {/* Search */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 3, md: 5 } }}>

          <SearchBar onSearch={(query) => setSearchQuery(query)} />

        </Box>

        {/* All Recipes */}
        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          All Recipes
        </Typography>

        <Box flex={1}>
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#10B981' }} />
              <Typography sx={{ ml: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>Loading delicious recipes...</Typography>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}. Showing sample recipes instead.
            </Alert>
          )}

          {/* Session Status Info */}
          {!loading && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {session?.user?.id
                  ? `Welcome back, ${session.user.name || session.user.username}! Showing recipes from our community.`
                  : 'Showing sample recipes. Log in to see more recipes from our community!'
                }
              </Typography>
            </Box>
          )}

          {/* Recipe Grid using RecipeCardWithFavorite */}
          <Box sx={{ mb: 4 }}>
            {getFilteredRecipes()
              .slice((currentPage - 1) * 12, currentPage * 12)
              .length > 0 ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: 'repeat(auto-fill, minmax(150px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                  md: 'repeat(auto-fill, minmax(280px, 1fr))'
                }, 
                gap: { xs: 2, sm: 3 } 
              }}>
                {getFilteredRecipes()
                  .slice((currentPage - 1) * 12, currentPage * 12)
                  .map((recipe) => (
                    <RecipeCardWithFavorite
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favoriteRecipes.some(fav => fav.id === recipe.id)}
                      onToggleFavorite={(recipeId, isFavorite) => {
                        // Update favorites list when toggled
                        if (isFavorite) {
                          // Add to favorites if not already there
                          if (!favoriteRecipes.some(fav => fav.id === recipeId)) {
                            const recipeToAdd = recipes.find(r => r.id === recipeId);
                            if (recipeToAdd) {
                              setFavoriteRecipes(prev => [...prev, recipeToAdd]);
                            }
                          }
                        } else {
                          // Remove from favorites
                          setFavoriteRecipes(prev =>
                            prev.filter(r => r.id !== recipeId)
                          );
                        }
                      }}
                    />
                  ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1">No recipes found in this category.</Typography>
              </Box>
            )}
          </Box>

          {/* Pagination  */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(getFilteredRecipes().length / 12)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                },
                '& .Mui-selected': {
                  backgroundColor: '#10B981',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#059669'
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Recommended Recipes */}
        <RecommendedRecipes
          recipes={getFilteredRecipes()}
          favoriteRecipes={favoriteRecipes}
          setFavoriteRecipes={setFavoriteRecipes}
        />

      </Box>

      {/* footer */}
      <Footer/>
    </Box>
  );
}
