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
import { getSession, useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import RecipeCardWithFavorite from "../components/RecipeCardWithFavorite";


export default function ProfilePage() {

  const [coverImage, setCoverImage] = useState("/cover-photo.jpg");
  const [profileImage, setProfileImage] = useState("/user-profile.jpg");


  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const uploadProfileImage = async (file) => {
    try {
      console.log("Uploading profile image:", file.name); // Debug log
      setUploading(true);

      // Convert file to base64
      const base64Image = await fileToBase64(file);

      const res = await fetch("/api/upload/profile", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'profile'
        }),
      });

      if (!res.ok) throw new Error("Failed to upload profile image");

      const data = await res.json();
      console.log("Profile upload response:", data); // Debug log

      setProfileImage(data.image_url); // UI preview with base64

      // ✅ Update user in DB with base64 image
      console.log("Updating user profile image in DB"); // Debug log

      const updateRes = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: data.image_url, // This is now base64
        }),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        console.error("Failed to update profile image in DB:", errorData);
        throw new Error("Failed to update profile image in database");
      }

      const updateData = await updateRes.json();
      console.log("Profile image updated in DB:", updateData); // Debug log

    } catch (err) {
      console.error("Upload profile image failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // Upload cover image with base64
  const uploadCoverImage = async (file) => {
    try {
      console.log("Uploading cover image:", file.name); // Debug log
      setUploading(true);

      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // 1. Upload cover image to server
      const res = await fetch("/api/upload/cover", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'cover'
        }),
      });

      if (!res.ok) throw new Error("Failed to upload cover image");

      const data = await res.json();
      console.log("Cover upload response:", data); // Debug log

      setCoverImage(data.image_url); // show preview in UI with base64

      // 2. Update user's cover image in database with base64
      console.log("Updating user cover image in DB"); // Debug log

      const updateRes = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverImage: data.image_url, // This is now base64
        }),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        console.error("Failed to update cover image in DB:", errorData);
        throw new Error("Failed to update cover image in database");
      }

      const updateData = await updateRes.json();
      console.log("Cover image updated in DB:", updateData); // Debug log

    } catch (err) {
      console.error("Upload cover image failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const router = useRouter();

  // User details state
  const [user, setUser] = useState(null);

  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === user?.id;


  // --- Pagination & Tabs ---
  const [currentPage, setCurrentPage] = useState(1);
  const [tabValue, setTabValue] = useState("home");
  const [filter, setFilter] = useState("latest"); // 'latest' or 'oldest'

  // Recipe states
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User recipes state
  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingUserRecipes, setLoadingUserRecipes] = useState(false);
  const [userRecipesError, setUserRecipesError] = useState(null);

  // Favorite recipes state
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);
  const [uploading, setUploading] = useState(false);


  //Profile Image

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
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Fetch all recipes
  const fetchRecipes = async () => {
    if (!session?.user?.id) {
      setRecipes(emptyRecipes);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/recipes");

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();

      // Transform database data to match UI expectations
      const transformedRecipes = data.recipes.map((recipe) => ({
        ...recipe,
        title: recipe.name, // Map name to title for UI compatibility
        author: recipe.user?.username || "Unknown Chef",
        image: recipe.image_url,
        rating: 4.6, // Default rating since we don't have ratings in DB yet
      }));

      setRecipes(transformedRecipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.message);
      setRecipes(emptyRecipes); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  console.log(session);

  // Fetch user recipes
  const fetchUserRecipes = async () => {
    if (!session?.user?.id) {
      setUserRecipes(emptyRecipes);
      return;
    }

    try {
      setLoadingUserRecipes(true);
      setUserRecipesError(null);

      const response = await fetch(
        `/api/users/recipes?userId=${session.user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user recipes");
      }

      const data = await response.json();
      setUserRecipes(data);
    } catch (err) {
      console.error("Error fetching user recipes:", err);
      setUserRecipesError(err.message);
      setUserRecipes(emptyRecipes); // Fallback to empty array
    } finally {
      setLoadingUserRecipes(false);
    }
  };

  // Fetch favorite recipes
  const fetchFavoriteRecipes = async () => {
    if (!session?.user?.id) {
      setFavoriteRecipes(emptyRecipes);
      return;
    }

    try {
      setLoadingFavorites(true);
      setFavoritesError(null);

      const response = await fetch(
        `/api/favourites/user?userId=${session.user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch favorite recipes");
      }

      const data = await response.json();

      setFavoriteRecipes(data);
    } catch (err) {
      console.error("Error fetching favorite recipes:", err);
      setFavoritesError(err.message);
      setFavoriteRecipes(emptyRecipes); // Fallback to empty array
    } finally {
      setLoadingFavorites(false);
    }
  };

  const getUserDetails = async () => {
    if (!session?.user?.id) {
      return;
    }
    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data);

      // Update image states with fetched data
      if (data.image_url) {
        setProfileImage(data.image_url);
      }
      if (data.coverImage) {
        setCoverImage(data.coverImage);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch data when component mounts or session changes
  useEffect(() => {
    fetchRecipes();
    fetchUserRecipes();
    fetchFavoriteRecipes();
    getUserDetails();
  }, [session]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: "1067px",
          width: "100%",
          mx: "auto",
        }}
      >
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
              backgroundImage: `url(${coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              p: 2,
              boxShadow: 1,
            }}
          >
            {/* <input
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
            /> */}

            <input
              accept="image/*"
              type="file"
              id="cover-photo-upload"

              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setCoverImage(imageUrl); // preview
                  uploadCoverImage(file); // ✅ upload
                }
              }}
            />


            {/* <label htmlFor="cover-photo-upload">
              <Button
                component="span"
                variant="contained"
                startIcon={<CameraAltIcon />}
                sx={{
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  textTransform: "none",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                Change cover photo
              </Button>
            </label> */}
          </Box>
          <Box sx={{ position: "relative" }}>
            <Avatar
              alt="User Profile"
              src={profileImage}
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
            {/* <input
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
            /> */}

            <input
              accept="image/*"
              type="file"
              id="profile-upload"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setProfileImage(imageUrl); // preview
                  uploadProfileImage(file); // ✅ upload
                }
              }}
            />


            {/* <label htmlFor="profile-upload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  top: "40px",
                  left: { xs: 90, sm: 110 },
                  bgcolor: "white",
                  border: "2px solid #ff7f00",
                  zIndex: 10,
                  "&:hover": { bgcolor: "#ff7f00" },
                }}
              >
                <CameraAltIcon fontSize="small" />
              </IconButton>
            </label> */}

          </Box>
          <Box sx={{ ml: { xs: "150px", sm: "180px" }, mt: { xs: 3, sm: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
                {user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userRecipes.length} Recipes
              </Typography>
            </Box>

          </Box>
        </Box>

        {/* Profile Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile navigation tabs"
          >
            <Tab
              label="Home"
              value="home"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            />
            <Tab
              label="Favorite Recipes"
              value="favorite"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === "home" && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">My Recipes</Typography>
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
                    "&:hover": {
                      bgcolor:
                        filter === "latest"
                          ? "#e65100"
                          : "rgba(255, 111, 0, 0.1)",
                    },
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
                    "&:hover": {
                      bgcolor:
                        filter === "oldest"
                          ? "#e65100"
                          : "rgba(255, 111, 0, 0.1)",
                    },
                  }}
                >
                  Oldest
                </Button>
              </Box>
            </Box>

            {/* Loading State */}
            {loadingUserRecipes && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#ff6f00" }} />
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
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" gutterBottom>
                  You haven't created any recipes yet.
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  href="/recipes/create"
                  sx={{
                    mt: 2,
                    bgcolor: "#ff6f00",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#e65100",

                    },
                  }}
                >
                  Create Your First Recipe
                </Button>
              </Box>
            )}

            {/* Recipes Grid */}
            {!loadingUserRecipes && userRecipes.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 3,
                    mb: 4,
                  }}
                >
                  {userRecipes
                    .sort((a, b) => {
                      if (filter === "latest") {
                        return (
                          new Date(b.createdAt || 0) -
                          new Date(a.createdAt || 0)
                        );
                      } else {
                        return (
                          new Date(a.createdAt || 0) -
                          new Date(b.createdAt || 0)
                        );
                      }
                    })
                    .slice((currentPage - 1) * 6, currentPage * 6)
                    .map((recipe) => (

                      <RecipeCardWithFavorite
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite={favoriteRecipes.some(fav => fav.id === recipe.id)}

                        onDelete={
                          isOwnProfile
                            ? async (id) => {
                              const confirmDelete = confirm("Are you sure you want to delete?");
                              if (!confirmDelete) return;

                              try {
                                const res = await fetch(`/api/recipes/${id}`, {
                                  method: "DELETE",
                                });

                                if (!res.ok) throw new Error("Failed to delete");

                                setUserRecipes((prev) => prev.filter((r) => r.id !== id));
                                setFavoriteRecipes((prev) => prev.filter((r) => r.id !== id));
                              } catch (error) {
                                console.error("Delete error:", error);
                                alert("Failed to delete");
                              }
                            }
                            : undefined // not your profile, no delete function passed
                        }

                        onToggleFavorite={(recipeId, isFavorite) => {
                          // Update favorites list when toggled
                          if (isFavorite) {
                            // Add to favorites if not already there
                            if (
                              !favoriteRecipes.some(
                                (fav) => fav.id === recipeId
                              )
                            ) {
                              const recipeToAdd = userRecipes.find(
                                (r) => r.id === recipeId
                              );
                              if (recipeToAdd) {
                                setFavoriteRecipes((prev) => [
                                  ...prev,
                                  recipeToAdd,
                                ]);
                              }
                            }
                          } else {
                            // Remove from favorites
                            setFavoriteRecipes((prev) =>
                              prev.filter((r) => r.id !== recipeId)
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
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
                        },
                        "& .Mui-selected": {
                          backgroundColor: "#ff6f00",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#e65100",
                          },
                        },
                      }}
                    />
                  </Stack>
                )}
              </>
            )}
          </Box>
        )}

        {tabValue === "favorite" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Favorite Recipes
            </Typography>

            {/* Loading State */}
            {loadingFavorites && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#ff6f00" }} />
                <Typography sx={{ ml: 2 }}>
                  Loading favorite recipes...
                </Typography>
              </Box>
            )}

            {/* Error State */}
            {favoritesError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {favoritesError}
              </Alert>
            )}

            {/* No Favorites State */}
            {!loadingFavorites && favoriteRecipes.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" gutterBottom>
                  You haven't favorited any recipes yet.
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  href="/recipes"
                  sx={{
                    mt: 2,
                    bgcolor: "#ff6f00",
                    "&:hover": {
                      bgcolor: "#e65100",
                    },
                  }}
                >
                  Browse Recipes
                </Button>
              </Box>
            )}

            {/* Favorites Grid */}
            {!loadingFavorites && favoriteRecipes.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 3,
                    mb: 4,
                  }}
                >
                  {favoriteRecipes
                    .slice((currentPage - 1) * 6, currentPage * 6)
                    .map((recipe) => (
                      <RecipeCardWithFavorite
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite={true}
                        onToggleFavorite={(recipeId, isFavorite) => {
                          if (!isFavorite) {
                            // Remove from favorites
                            setFavoriteRecipes((prev) =>
                              prev.filter((r) => r.id !== recipeId)
                            );
                          }
                        }}
                      />
                    ))}
                </Box>

                {/* Pagination */}
                {favoriteRecipes.length > 6 && (
                  <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
                    <Pagination
                      count={Math.ceil(favoriteRecipes.length / 6)}
                      page={currentPage}
                      onChange={handlePageChange}
                      siblingCount={0}
                      boundaryCount={1}
                      showFirstButton
                      showLastButton
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
                        },
                        "& .Mui-selected": {
                          backgroundColor: "#ff6f00",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#e65100",
                          },
                        },
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


// "use client";

// import React, { useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import ImageUploadCircle from "../components/imageUploadCircle"; // Import your component

// export default function ImageUploadAndSave() {
//   const [image, setImage] = useState(""); // This will store Base64 image data
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSaveImage = async () => {
//     if (!image) {
//       setMessage("Please upload an image first.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const payload = { image };

//       const res = await fetch("/api/users/upload", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save image");

//       setMessage("Image saved successfully!");
//     } catch (err) {
//       console.error("Image Upload Error:", err);
//       setMessage("Error saving image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
//       <Typography variant="h6">Upload Profile Image</Typography>

//       <ImageUploadCircle
//         image={image}
//         setImage={setImage}
//         size={100}
//         label="Upload"
//         showRemove
//       />

//       {message && (
//         <Typography color={message.includes("Error") ? "error" : "success.main"}>
//           {message}
//         </Typography>
//       )}

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSaveImage}
//         disabled={loading}
//       >
//         {loading ? "Saving..." : "Save Image"}
//       </Button>
//     </Box>
//   );
// }
