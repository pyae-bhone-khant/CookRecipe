"use client";

import React from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";

import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import '../styles/nprogress.css';
import TrendingSlider from "../components/TrendingSlider";
import AppLayout from "../components/AppLayout";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RecipeCardWithFavorite from "../components/RecipeCardWithFavorite";
import SearchBar from "../components/SearchBar";
import axios from "axios";


export default function RecipeListPage() {


  const router = useRouter();
  const { data: session, status } = useSession();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const openProfile = Boolean(anchorEl);
  const openNotification = Boolean(anchorE2);
  const handleClickProfile = (event) => setAnchorEl(event.currentTarget);
  const handleClickNotification = (event) => setAnchorE2(event.currentTarget);
  const handleCloseProfile = () => setAnchorEl(null);
  const handleCloseNotification = () => setAnchorE2(null);
  const [currentPage, setCurrentPage] = useState(1);


  // Database recipe states
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Selected Page:", page);
  };

  // loading
  const handleNavigate = (path) => {
    NProgress.start();
    router.push(path);
  };



  // State ကို ထပ်ထည့်ပါ
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Empty fallback for recipes
  const emptyRecipes = [];

  // Favorite recipes state
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  // Fetch recipes from database
  const fetchRecipes = async () => {
    if (!session?.user?.id) {
      setRecipes(emptyRecipes);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recipes');

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      // Transform database data to match UI expectations
      //     const transformedRecipes = data.recipes.map(recipe => ({
      //       ...recipe,
      //       title: recipe.name, // Map name to title for UI compatibility
      //       author: recipe.user?.username || 'Unknown Chef',
      //       image: recipe.image_url,
      //       rating: 4.6 // Default rating since we don't have ratings in DB yet
      //     }));



      const transformedRecipes = data.recipes.map(recipe => ({
        ...recipe,
        title: recipe.name,
        author: recipe.user?.username || 'Unknown Chef',
        image: recipe.image_url,
        categoryName: recipe.category?.name || "Uncategorized", // ✅ ဒီလိုထည့်
        average_rating: recipe.ratings
      }));

      setRecipes(transformedRecipes);
      // console.log("rescipe with ratings",transformedRecipes);
      
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
      setRecipes(emptyRecipes); // Fallback to empty array
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
    //   data.forEach((recipe, index) => {
    //   console.log(`Recipe ${index + 1}: ${recipe.name}`);
    //   console.log("Ratings:", recipe.ratings);

    //   // Optionally calculate average
    //   const total = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    //   const avg = recipe.ratings.length > 0 ? (total / recipe.ratings.length).toFixed(1) : "No ratings";
    //   console.log(`Average Rating: ${avg} ⭐`);
    // });
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
        recipe.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      );

    if (!searchQuery.trim()) return filteredByCategory;

    return filteredByCategory.filter(recipe =>
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };



  // navbar more
  const [anchorElMore, setAnchorElMore] = React.useState(null);
  const openMore = Boolean(anchorElMore);

  const handleClickMore = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorElMore(null);
  };

  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

  const handleConfirmLogout = () => {
    setOpenLogoutDialog(false);
    console.log("User confirmed log out");
    // router.push("/");
    handleNavigate('/');

  };

  // categories api
  const getCategories = async () => {
    try {
      console.log("getCategories()");
      const response = await axios.get("/api/admin/categories");
      console.log("API response:", response);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setCategories([]);
    }
  };
  useEffect(() => {
    console.log("Categories", categories);

    getCategories();
  }, []);

  return (
    <AppLayout>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <TrendingSlider />

        {/* Search + Categories */}
        <Box mt={5}>
          <Typography variant="h4" textAlign="center"
            sx={{ fontWeight: 'bold', color: '#008000' }}
          >
            What to Cook?
          </Typography>

          {/* search */}
          <Stack direction="row" justifyContent="center" mt={2}>

            <SearchBar onSearch={(query) => setSearchQuery(query)} />

          </Stack>
        </Box>

        <Stack direction="row" spacing={4} mt={4}>
          {/* Category Filters */}


          <Stack spacing={2}>
            <Typography variant="h6">Categories</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <Button
                variant={selectedCategory === "All" ? "contained" : "outlined"}
                onClick={() => setSelectedCategory("All")}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  backgroundColor: selectedCategory === "All" ? '#ff6f00' : 'transparent',
                  color: selectedCategory === "All" ? 'white' : 'inherit',
                  transition: 'transform 0.5s',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    backgroundColor: selectedCategory === "All" ? '#e65100' : '#fff3e0',
                    transform: 'translateY(-5px)',
                  }
                }}
              >
                All
              </Button>

              {/* Dynamic Category Buttons from API */}
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "contained" : "outlined"}
                  onClick={() => setSelectedCategory(category.name)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    backgroundColor: selectedCategory === category.name ? '#ff6f00' : 'transparent',
                    color: selectedCategory === category.name ? 'white' : 'inherit',
                    transition: 'all 0.5s ease',
                    '&:hover': {
                      backgroundColor: selectedCategory === category.name ? '#e65100' : '#fff3e0',
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  {category.name}
                </Button>
              ))}

            </Box>
          </Stack>


          {/* Recipe Cards */}
          <Box flex={1}>
            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#ff6f00' }} />
                <Typography sx={{ ml: 2 }}>Loading delicious recipes...</Typography>
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
                <Typography variant="body2" color="text.secondary">
                  {session?.user?.id
                    ? `Welcome back, ${session.user.name || session.user.username}! Showing recipes from our community.`
                    : 'Showing sample recipes. Log in to see more recipes from our community!'
                  }
                </Typography>
              </Box>
            )}

            {/* Recipe Grid using RecipeCardWithFavorite component */}
            <Box sx={{ mb: 4 }}>
              {getFilteredRecipes()
                .slice((currentPage - 1) * 12, currentPage * 12)
                .length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
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
                    backgroundColor: '#ff6f00',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#e65100'
                    }
                  }
                }}
              />
            </Box>

          </Box>

        </Stack>

      </Container>

      {/* footer */}
      <Footer />

    </AppLayout>
  );
}
