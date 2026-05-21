"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useRouter } from "next/navigation";
import Link from "next/link";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import RecipeCardWithFavorite from "@/app/components/RecipeCardWithFavorite";

export default function UploaderProfilePage({ params }) {
  const userId = params.id;
  const router = useRouter();
  const { data: session } = useSession();
  const [uploader, setUploader] = useState(null);
  const [user, setUser] = useState(null);

  // --- Image state for cover and profile ---
  const [coverImage, setCoverImage] = useState("/cover-photo.jpg");
  const [profileImage, setProfileImage] = useState("/user-profile.jpg");

  // --- Pagination & Tabs ---
  const [currentPage, setCurrentPage] = useState(1);
  const [tabValue, setTabValue] = useState("home");
  const [filter, setFilter] = useState("latest"); // 'latest' or 'oldest'

  // Recipe states
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User recipes state
  const [recipe, setRecipe] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingUserRecipes, setLoadingUserRecipes] = useState(false);
  const [userRecipesError, setUserRecipesError] = useState(null);

  // Favorite recipes state
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);

  // Empty fallback for recipes
  const emptyRecipes = [];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  };

  // Handle page change with smooth scroll
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fetchUserData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${session.user.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when session changes
  useEffect(() => {
    fetchUserData();
  }, [session?.user?.id]);


  // Fetch all recipes
  const fetchRecipes = async () => {
    if (!recipe.user?.id) {
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
      console.log('Fetched recipes:', data);

      // Transform database data to match UI expectations
      const transformedRecipes = data.recipes.map(recipe => ({
        ...recipe,
        title: recipe.name, // Map name to title for UI compatibility
        author: recipe.user?.username || 'Unknown Chef',
        image: recipe.image_url,
        rating: 4.6 // Default rating since we don't have ratings in DB yet
      }));

      setRecipes(transformedRecipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
      setRecipes(emptyRecipes); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  console.log(session);


  // Fetch user recipes

  const fetchUserRecipes = async () => {
  if (!userId) {
    setUserRecipes(emptyRecipes);
    return;
  }

  try {
    setLoadingUserRecipes(true);
    setUserRecipesError(null);

    const response = await fetch(`/api/users/recipes?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user recipes');

    const data = await response.json();

    // session user id and profile owner id 
    const isOwner = session?.user?.id === userId;

    // owner approve filter
    const filteredRecipes = isOwner
      ? data
      : data.filter(recipe => recipe.status === 'approve');

    setUserRecipes(filteredRecipes);
  } catch (err) {
    console.error('Error fetching user recipes:', err);
    setUserRecipesError(err.message);
    setUserRecipes(emptyRecipes);
  } finally {
    setLoadingUserRecipes(false);
  }
};



  // Fetch favorite recipes
  const fetchFavoriteRecipes = async () => {
    if (!userId) {
      setFavoriteRecipes(emptyRecipes);
      return;
    }

    try {
      setLoadingFavorites(true);
      setFavoritesError(null);

      const response = await fetch(`/api/favourites/user?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch favorite recipes');
      }

      const data = await response.json();
      // console.log('Fetched favorite recipes:', data);

      setFavoriteRecipes(data);
    } catch (err) {
      console.error('Error fetching favorite recipes:', err);
      setFavoritesError(err.message);
      setFavoriteRecipes(emptyRecipes); // Fallback to empty array
    } finally {
      setLoadingFavorites(false);
    }
  };



  useEffect(() => {
    const fetchUploader = async () => {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setUploader(data);
    };

    if (userId) fetchUploader();
    fetchRecipes();
    fetchUserRecipes();
    fetchFavoriteRecipes();
  }, [userId]);


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />

      <Box component="main" sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1067px", width: "100%", mx: "auto" }}>
        {/* Profile Header */}
        <Box sx={{ position: "relative", mb: 4 }}>
          <Box

            sx={{
              height: 200,
              backgroundColor: "#eee",
              borderRadius: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",

              backgroundImage: `url(${uploader?.coverImage || coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              p: 2,
              boxShadow: 1,
            }}
          >
            <input
              accept="image/*"
              type="file"
              id="cover-upload"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setCoverImage(imageUrl);
                }
              }}
            />

          </Box>
          <Box sx={{ position: "relative" }}>
            <Avatar
              alt="User Profile"
              src={uploader?.image_url || undefined}
              sx={{
                width: 120,
                height: 120,
                position: "absolute",
                top: "-50px",
                left: { xs: 16, sm: 30 },
                border: "4px solid white",
                boxShadow: 3,
              }}
            />
            <input
              accept="image/*"
              type="file"
              id="profile-upload"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setProfileImage(imageUrl);
                }
              }}
            />

          </Box>
          <Box sx={{ ml: { xs: "150px", sm: "180px" }, mt: { xs: 3, sm: 2 } }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
              {uploader?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userRecipes.length} Recipes
            </Typography>
          </Box>
        </Box>



        {/* Tab Content */}
        {tabValue === "home" && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6"> Recipes</Typography>
              <Box>
                <Button
                  variant={filter === "latest" ? "contained" : "text"}
                  onClick={() => setFilter("latest")}
                  size="small"
                  sx={{
                    textTransform: "none",
                    mr: 1,

                    bgcolor: filter === "latest" ? "#ff6f00" : "transparent",
                    color: filter === "latest" ? "white" : "#ff6f00",
                    '&:hover': {

                      bgcolor: filter === "latest" ? "#e65100" : "rgba(255, 111, 0, 0.1)",
                    }
                  }}
                >
                  Latest
                </Button>
                <Button
                  variant={filter === "oldest" ? "contained" : "text"}
                  onClick={() => setFilter("oldest")}
                  size="small"
                  sx={{
                    textTransform: "none",
                    bgcolor: filter === "oldest" ? "#ff6f00" : "transparent",
                    color: filter === "oldest" ? "white" : "#ff6f00",
                    '&:hover': {
                      bgcolor: filter === "oldest" ? "#e65100" : "rgba(255, 111, 0, 0.1)",
                    }
                  }}
                >
                  Oldest
                </Button>
              </Box>
            </Box>

            {/* Loading State */}
            {loadingUserRecipes && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#ff6f00' }} />
                <Typography sx={{ ml: 2 }}>Loading your recipes...</Typography>
              </Box>
            )}

            {/* Error State */}
            {userRecipesError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {userRecipesError}
              </Alert>
            )}

            {/* No Recipes State */}
            {!loadingUserRecipes && userRecipes.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" gutterBottom>You haven't created any recipes yet.</Typography>
                <Button
                  variant="contained"
                  component={Link}
                  href="/recipes/create"
                  sx={{
                    mt: 2,
                    bgcolor: '#ff6f00',
                    '&:hover': {
                      bgcolor: '#e65100',
                    }
                  }}
                >
                  Create Your First Recipe
                </Button>
              </Box>
            )}

            {/* Recipes Grid */}
            {!loadingUserRecipes && userRecipes.length > 0 && (
              <>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 3,
                  mb: 4
                }}>
                  {userRecipes
                    .sort((a, b) => {
                      if (filter === "latest") {
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                      } else {
                        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                      }
                    })
                    .slice((currentPage - 1) * 6, currentPage * 6)
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
                              const recipeToAdd = userRecipes.find(r => r.id === recipeId);
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

                {/* Pagination */}
                {userRecipes.length > 6 && (
                  <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
                    <Pagination
                      count={Math.ceil(userRecipes.length / 6)}
                      page={currentPage}
                      onChange={handlePageChange}
                      siblingCount={0}
                      boundaryCount={1}
                      showFirstButton
                      showLastButton
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
                  </Stack>
                )}
              </>
            )}
          </Box>
        )}

        {tabValue === "recipes" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              All Recipes
            </Typography>

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#ff6f00' }} />
                <Typography sx={{ ml: 2 }}>Loading recipes...</Typography>
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Recipes Grid */}
            {!loading && recipes.length > 0 && (
              <>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 3,
                  mb: 4
                }}>
                  {recipes
                    .slice((currentPage - 1) * 6, currentPage * 6)
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

                {/* Pagination */}
                {recipes.length > 6 && (
                  <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
                    <Pagination
                      count={Math.ceil(recipes.length / 6)}
                      page={currentPage}
                      onChange={handlePageChange}
                      siblingCount={0}
                      boundaryCount={1}
                      showFirstButton
                      showLastButton
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
                  </Stack>
                )}
              </>
            )}
          </Box>
        )}


      </Box>
    </Box>
  );
}

