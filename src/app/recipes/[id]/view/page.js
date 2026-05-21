"use client";

import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Container,
  Paper,
  Stack,
  Button,
  TextField,
  Chip,
  Rating,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import axios from "axios";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import NProgress from "nprogress";
import { useSession } from "next-auth/react";
import ShareButton from "../../../components/ShareButton";
import RecommendedRecipes from "../../../components/RecommendedRecipes";
import Footer from "@/app/components/Footer";

export default function RecipeDetailPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const params = useParams();
  const recipeId = params.id;
  //const[rating,setRating]=useState([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [value, setValue] = useState(0);
  const [average, setAverage] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [recipes, setRecipes] = useState([]);
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

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleNavigate = (path) => {
    NProgress.start();
    router.push(path);
  };
  // Recipe data state
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //History
  const logHistory = async (recipeId, action) => {
    try {
      await axios.post('/api/histories', {
        recipeId: parseInt(recipeId),
        action,
        //message, // e.g. "viewed", "liked", etc.
      });
    } catch (err) {
      console.error('Failed to log history', err);
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

  // Fetch recipe data
  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/recipes/${recipeId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await response.json();
      setRecipe(data);

      // ✅ VIEWED history မှတ်တမ်းထည့်


    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/api/comments`, {
        text: commentText,
        recipeId: recipeId,
      });

      setComments((prev) => [...prev, res.data]);
      setCommentText("");

      // ✅ COMMENTED history မှတ်တမ်းထည့်
      if (userId) {
        await logHistory(recipeId, "commented"); // ✅ FIXED
      }

    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments?recipeId=${recipeId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  //Reply
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;

    await axios.post("/api/comments", {
      text: replyText,
      recipeId: recipe.id,
      parentId: commentId,
    });

    setReplyText("");
    setReplyTo(null);
    fetchComments(); // reload comments
  };

  //Delete comment
  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  //Like
  const fetchLikes = async () => {
    try {
      const res = await axios.get(`/api/likes?recipeId=${recipeId}`);
      setLikeCount(res.data.count);
      setLiked(res.data.users.some((u) => u.id === userId));
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  };

  const toggleLike = async () => {
    try {
      await axios.put("/api/likes", { userId, recipeId });
      await fetchLikes();

      // ✅ LIKED history မှတ်တမ်းထည့်
      if (userId) {
        await logHistory(recipeId, "liked"); // ✅ FIXED
      }

    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  useEffect(() => {
    if (userId && recipeId) {
      fetchLikes();
    }
  }, [userId, recipeId]);

  //Rating
  useEffect(() => {
    // Get current user's rating
    if (session?.user?.id) {
      axios
        .get(`/api/ratings?recipeId=${recipeId}&userId=${session.user.id}`)
        .then((res) => setValue(res.data?.rating || 0))
        .catch((err) => console.error("User rating fetch error", err));
    }

    // Get average rating
    axios
      .get(`/api/ratings/average?recipeId=${recipeId}`)
      .then((res) => setAverage(res.data.average || 0))
      .catch((err) => console.error("Average rating error", err));
  }, [session?.user?.id, recipeId]);

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



  // console.log(recipe?.id);

  const handleChange = async (_, newValue) => {
    setValue(newValue);
    try {
      await axios.post("/api/ratings", {
        recipeId: recipe?.id,
        userId: session?.user?.id,
        rating: newValue,
      });

      // Update average after submission
      const res = await axios.get(`/api/ratings/average?recipeId=${recipeId}`);
      setAverage(res.data.average || 0);
    } catch (error) {
      console.error("Rating error", error);
    }
  };


  // Loading state
  if (loading) {
    return (
      <Box>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress sx={{ color: "#ff6f00" }} />
            <Typography sx={{ ml: 2 }}>Loading recipe...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => router.push("/recipes")}
            sx={{ backgroundColor: "#ff6f00" }}
          >
            Back to Recipes
          </Button>
        </Container>
      </Box>
    );
  }

  // Recipe not found
  if (!recipe) {
    return (
      <Box>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Recipe not found
          </Alert>
          <Button
            variant="contained"
            onClick={() => router.push("/recipes")}
            sx={{ backgroundColor: "#ff6f00" }}
          >
            Back to Recipes
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          {/* Left Side */}
          <Box flex={2}>
            <Card elevation={6} sx={{ borderRadius: 3 }}>
              <CardMedia
                component="img"
                width="400"
                height="500"
                image={recipe.image_url || "/images/food1.jpg"}
                alt={recipe.name}
              />
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  px={1}
                  mt={1}
                  mb={1}
                >
                  <Stack direction="row" spacing={2} mt={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {recipe.name}
                    </Typography>
                    <Chip
                      label={recipe.category?.name || "Unknown"}
                      sx={{
                        backgroundColor: "#fff3e0",
                        color: "#ff6f00",
                        textTransform: "capitalize",
                      }}
                    />
                  </Stack>
                  {/* <Rating value={4} readOnly size="small" /> */}
                  <Box sx={{ mt: 2 }}>
                    <Typography>Average Rating: {average}/5</Typography>
                    <Rating value={average} precision={0.5} readOnly />

                    <Typography sx={{ mt: 1 }}>
                      {session ? "Your Rating:" : "Log in to rate"}
                    </Typography>
                    {session && (
                      <Rating
                        name="user-rating"
                        value={value}
                        onChange={handleChange}
                        precision={1}
                      />
                    )}
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  px={1}
                  mt={1}
                  mb={1}
                >
                  {/* //profile */}
                  <Stack direction="row" alignItems="center" spacing={1} my={1}>
                    <Avatar
                      onClick={() =>
                        handleNavigate(`/profile/${recipe.user?.id}`)
                      }
                      src={recipe.user?.image_url || undefined}
                      sx={{
                        bgcolor: "#ff7f00",
                        cursor: "pointer",
                        transition: "transform 0.3s",
                        "&:hover": {
                          backgroundColor: "#e86f00",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      {recipe.user?.username?.charAt(0) || "U"}
                    </Avatar>
                    <Typography variant="body2">
                      {recipe.user?.username || "Unknown Chef"}
                    </Typography>
                  </Stack>
                  {/* Button */}
                  <Stack direction="row" spacing={1} my={1}>
                    <Button
                      variant="outlined"
                      startIcon={liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      size="small"
                      onClick={toggleLike}
                      color={liked ? "primary" : "inherit"}
                    >
                      {likeCount}
                    </Button>

                    <ShareButton
                      title={`Check out ${recipe.name}`}
                      text={`I found this amazing recipe: ${recipe.name}`}
                      url={typeof window !== "undefined" ? window.location.href : ""}
                    />
                  </Stack>

                </Stack>


                <Stack direction="row" spacing={2} mt={2}>
                  <Chip
                    label={`Prep Time - ${recipe.pre_cooking_time}`}
                    variant="outlined"
                  />
                  <Chip
                    label={`Cook Time - ${recipe.cooking_time}`}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Comments */}

            <Paper variant="outlined" sx={{ mt: 4, p: 2 }}>
              <Typography variant="h6">Comments</Typography>

              {/* Scrollable comment list */}
              <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
                {comments.map((comment) => (
                  <Box key={comment.id} mt={2}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        onClick={() =>
                          handleNavigate(`/profile/${comment.user?.id}`)
                        }
                        src={comment.user?.image_url || undefined}
                        sx={{
                          bgcolor: "#ff7f00",
                          cursor: "pointer",
                          transition: "transform 0.3s",
                          "&:hover": {
                            backgroundColor: "#e86f00",
                            transform: "translateY(-3px)",
                          },
                        }}
                      >{comment.user.username?.charAt(0)}</Avatar>

                      <Box>
                        <Typography fontWeight="bold">
                          {comment.user.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleTimeString()}
                        </Typography>
                        <Typography mt={0.5}>{comment.text}</Typography>

                        <Stack direction="row" spacing={1} mt={1}>
                          <Button
                            size="small"
                            onClick={() => toggleReplies(comment.id)}
                          >
                            {comment.replies?.length || 0}{" "}
                            {comment.replies?.length === 1
                              ? "reply"
                              : "replies"}
                          </Button>
                          <Button
                            size="small"
                            onClick={() => setReplyTo(comment.id)}
                          >
                            Reply
                          </Button>
                          {/* //Delete comment */}

                          {/* {session?.user.id === comment.userId && (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </Button>
                          )} */}

                          {(session?.user.id === comment.userId || session?.user.id === recipe.user?.id) && (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </Button>
                          )}



                        </Stack>

                        {/* REPLY TEXT FIELD */}
                        {replyTo === comment.id && (
                          <Stack direction="row" spacing={1} mt={1}>
                            <TextField
                              size="small"
                              fullWidth
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                            />
                            <Button
                              onClick={() => handleReplySubmit(comment.id)}
                              variant="contained"
                              sx={{ bgcolor: "#F57C00", color: "#fff" }}
                            >
                              Send
                            </Button>

                          </Stack>
                        )}

                        {/* SHOW REPLIES */}
                        {showReplies[comment.id] &&
                          comment.replies.length > 0 && (
                            <Box mt={2} pl={4}>
                              {comment.replies.map((reply) => (
                                <Stack
                                  key={reply.id}
                                  direction="row"
                                  spacing={2}
                                  mt={1}
                                >
                                  <Avatar
                                    src={reply.user?.image_url || undefined}
                                    onClick={() =>
                                      handleNavigate(`/profile/${reply.user?.id}`)
                                    }
                                    sx={{
                                      bgcolor: "#ff7f00",
                                      cursor: "pointer",
                                      transition: "transform 0.3s",
                                      "&:hover": {
                                        backgroundColor: "#e86f00",
                                        transform: "translateY(-3px)",
                                      },
                                    }}
                                  >
                                    {reply.user.username?.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                                      <Typography fontWeight="bold">
                                      {reply.user.username}
                                    </Typography>

                                    {/* Delect comment */}
                                    {(session?.user.id === reply.userId || session?.user.id === recipe.user?.id) && (
                                      <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteComment(reply.id)}
                                      >
                                        Delete
                                      </Button>
                                    )}
                                    </div>

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {new Date(
                                        reply.createdAt
                                      ).toLocaleTimeString()}
                                    </Typography>
                                    <Typography mt={0.5}>
                                      {reply.text}
                                    </Typography>


                                  </Box>
                                </Stack>
                              ))}
                            </Box>
                          )}

                      </Box>
                    </Stack>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Box>

              {/* Add comment input */}
              <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                {/* <Avatar sx={{ width: 32, height: 32 }}>U</Avatar> */}
                <Avatar
                  onClick={() => handleNavigate(`/profile/${session.user?.id}`)}
                  src={user?.image_url || undefined}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#ff7f00",
                    cursor: "pointer",
                    transition: "transform 0.3s",
                    "&:hover": {
                      backgroundColor: "#e86f00",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {session.user?.username?.charAt(0) || "U"}
                </Avatar>
                <TextField
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Add a comment"
                  fullWidth
                />
                <Button
                  onClick={handleAddComment}
                  variant="contained"
                  sx={{ bgcolor: "#F57C00", color: "#fff" }}
                >
                  Send
                </Button>
              </Stack>
            </Paper>
          </Box>

          {/* Right Side */}
          <Box flex={1}>
            <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ingredients
              </Typography>
              <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1, p: 1 }}>
                <Typography variant="body2" whiteSpace="pre-line">
                  {recipe.ingredient}
                </Typography>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Instructions
              </Typography>
              <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1, p: 1 }}>
                <Typography variant="body2" whiteSpace="pre-line">
                  {recipe.instruction}
                </Typography>
              </Box>

            </Paper>

            {/* Video Section */}
            {recipe.video_url && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Video Tutorial
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <iframe
                    src={recipe.video_url}
                    title="Recipe Video"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    allowFullScreen
                  />
                </Box>
              </Paper>
            )}
          </Box>
        </Stack>

        {/* Recommend Section */}
        <RecommendedRecipes
          recipes={getFilteredRecipes()}
          favoriteRecipes={favoriteRecipes}
          setFavoriteRecipes={setFavoriteRecipes}
        />

      </Container>

      {/* Footer */}
      <Footer />

    </Box>
  );
}
