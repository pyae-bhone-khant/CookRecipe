"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  FormHelperText,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Menu,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";

import Link from "next/link"; // Next.js ရဲ့ Link component

import Badge from "@mui/material/Badge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSession } from "next-auth/react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import LinearProgress from "@mui/material/LinearProgress";
import Navbar from "@/app/components/Navbar";
import InputAdornment from "@mui/material/InputAdornment";

import { Suspense } from "react";


import RestaurantIcon from "@mui/icons-material/Restaurant";
import TimerIcon from "@mui/icons-material/Timer";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArticleIcon from "@mui/icons-material/Article";



const schema = yup.object().shape({
  name: yup.string().required("Recipe name is required"),

  ingredient: yup
    .string()
    .min(10, "Ingredients should be at least 10 characters")
    .required("Ingredients are required"),

  instruction: yup
    .string()
    .min(10, "Instructions should be at least 10 characters")
    .required("Instructions are required"),

  category_id: yup
    .string()
    .required("Category is required"),

  pre_cooking_time: yup.string().required("Pre-cooking time is required"),

  cooking_time: yup.string().required("Cooking time is required"),

  image_url: yup.string().required("Image is required"),
});

export default function SubmitRecipePage() {


  // navbar
  const [anchorElMore, setAnchorElMore] = React.useState(null);
  const openMore = Boolean(anchorElMore);

  const handleClickMore = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorElMore(null);
  };

  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
  const { data: session } = useSession();
  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

  const handleConfirmLogout = () => {
    setOpenLogoutDialog(false);
    console.log("User confirmed log out");
    router.push("/");
    // သင့် Log Out Logic ထည့်ပါ (ဥပမာ: router.push("/login"))
  };


  // nav
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const openProfile = Boolean(anchorEl);
  const openNotification = Boolean(anchorE2);
  const handleClickProfile = (event) => setAnchorEl(event.currentTarget);
  const handleClickNotification = (event) => setAnchorE2(event.currentTarget);
  const handleCloseProfile = () => setAnchorEl(null);
  const handleCloseNotification = () => setAnchorE2(null);
  const [currentPage, setCurrentPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Selected Page:", page);
    // You can also fetch data for this page here
  };


  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      category_id: "",
      pre_cooking_time: "",
      cooking_time: "",
      instruction: "",
      ingredient: "",
      image_url: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'recipe'
        }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return await response.json();
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('Image upload failed');
      return null;
    }
  };

  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    pre_cooking_time: "",
    cooking_time: "",
    instruction: "",
    ingredient: "",
    imageFile: null,
  });





  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(10);

      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // Set preview to base64 image
      setPreview(base64Image);
      setUploadProgress(50);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'recipe'
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      // Set the base64 image URL in the form data
      setValue("image_url", result.image_url, { shouldValidate: true });
      setImageFile(file);
      setUploadProgress(100);

      // Clear progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);

    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Image upload failed");
      setMessageType("error");
      setUploadProgress(0);
      setPreview(null);
    }
  };


  const onSubmit = async (data) => {
    console.log("Form data:", data);

    if (!session?.user?.id) {
      setMessage("You must be logged in to submit a recipe.");
      setMessageType("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("Submitting recipe...");
      setMessageType("info");

      const recipeData = {
        user_id: session.user.id,
        name: data.name,
        ingredient: data.ingredient,
        instruction: data.instruction,
        category_id: data.category_id,
        pre_cooking_time: data.pre_cooking_time,
        cooking_time: data.cooking_time,
        image_url: data.image_url,
        video_url: null,
        status: "approve"
      };

      console.log("Sending recipe data to API:", recipeData);

      // Add timeout to the request
      const response = await axios.post("/api/recipes", recipeData, {
        timeout: 10000 // 10 second timeout
      });

      console.log("API response:", response.data);

      setMessage("Recipe submitted successfully! Redirecting to home page...");
      setMessageType("success");

      setTimeout(() => {
        router.push("/home");
      }, 2000);

    } catch (error) {
      console.error("Submission error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(", ") || 
                          error.message || 
                          "Failed to submit recipe";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };









  const getCategories = async () => {
    try {
      console.log("getCategories()");
      const response = await axios.get("/api/admin/categories");
      console.log("API response:", response);
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setCategories([]);
    }
  };
  useEffect(() => {
    console.log("Categories", categories);

    getCategories();
  }, []);


  return (
    <Box sx={{ fontFamily: "system-ui, sans-serif" }}>

      <Navbar />

      {/* Banner */}
      <Box
        sx={{
          backgroundImage: `url("/images/create-bg.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          color: "white",
          py: { xs: 6, md: 8 },
          px: 2,
          mt: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" fontWeight="bold">
                Share Your{" "}
                <Box component="span" sx={{ color: "#facc15" }}>
                  Favorite Recipe
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
                Inspire food lovers by submitting your delicious creation.
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
          </Box>
        </Container>
      </Box>


      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          boxShadow: 10,
          bgcolor: "#fffefc",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          // Background image ကို ဒီနေရာမှာ ထည့်ပါ
          backgroundImage: `url("/images/create-footer.jpg")`, // သင့်ရဲ့ image URL ကို ထည့်ပါ
          backgroundSize: "cover", // Paper ရဲ့ ဧရိယာတစ်ခုလုံးကို ဖုံးအုပ်ဖို့
          backgroundPosition: "top", // Image ကို အလယ်မှာထားဖို့
          backgroundRepeat: "no-repeat", // Image ကို ထပ်မနေစေဖို့
          // စာသားတွေ ပိုမိုဖတ်လို့ရအောင် အလင်းဖျော့တဲ့ overlay တစ်ခု ထည့်သွင်းနိုင်ပါတယ်
          position: 'relative', // overlay အတွက် လိုအပ်ပါတယ်
          '&::before': { // Pseudo-element ကို အသုံးပြုပြီး overlay လုပ်တာပါ
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: 'rgba(255, 255, 255, 0.2)', // အဖြူရောင် အလင်းဖျော့ overlay
            borderRadius: 4, // Paper ရဲ့ border-radius နဲ့ ကိုက်ညီဖို့
            zIndex: 2, // Content အောက်မှာထားဖို့
          },
          '& > *': { // Paper ရဲ့ direct children တွေကို overlay ပေါ်မှာပေါ်အောင်ထားဖို့
            zIndex: 2,
            position: 'relative',
          }
        }}
      >
        {/* သင့်ရဲ့ form အကြောင်းအရာများ */}

        {/* Recipe Form */}
        <Box sx={{ mt: 6, pb: 10 }}>
          <Container maxWidth="md">
            <Paper
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              elevation={6}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 4,
                boxShadow: 10,
                bgcolor: "#fffefc",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                color="primary"
              >
                🍽️ Submit a Recipe
              </Typography>

              {message && (
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor:
                      messageType === "success" ? "success.light" : "error.light",
                    color:
                      messageType === "success"
                        ? "success.contrastText"
                        : "error.contrastText",
                  }}
                >
                  {message}
                </Box>
              )}

              <Stack spacing={3}>

                <TextField
                  label="Recipe Name"
                  fullWidth
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RestaurantIcon color="warning" />
                      </InputAdornment>
                    ),
                  }}
                />


                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >

                  <TextField
                    label="Pre Cooking Time (min)"
                    fullWidth
                    {...register("pre_cooking_time")}
                    error={!!errors.pre_cooking_time}
                    helperText={errors.pre_cooking_time?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimerIcon color="info" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Cooking Time (min)"
                    fullWidth
                    {...register("cooking_time")}
                    error={!!errors.cooking_time}
                    helperText={errors.cooking_time?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimerIcon color="error" />
                        </InputAdornment>
                      ),
                    }}
                  />

                </Box>

                <FormControl fullWidth error={!!errors.category_id}>
                  <InputLabel id="category-label">

                    Category
                  </InputLabel>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        label="Category"
                        value={field.value || ""}
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon />
                          </InputAdornment>
                        }
                      >
                        {categories?.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#ff6f00',
                                color: 'white',
                              },
                            }}
                          >
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.category_id?.message}</FormHelperText>
                </FormControl>


                <TextField
                  label="Ingredients"
                  multiline
                  rows={5}
                  fullWidth
                  {...register("ingredient")}
                  error={!!errors.ingredient}
                  helperText={errors.ingredient?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ListAltIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Instructions"
                  multiline
                  rows={5}
                  fullWidth
                  {...register("instruction")}
                  error={!!errors.instruction}
                  helperText={errors.instruction?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ArticleIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      color: "#fb923c",
                      borderColor: "#fb923c",
                      fontWeight: "bold",
                      "&:hover": {
                        bgcolor: "#fff7ed",
                        borderColor: "#f97316",
                      },
                    }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <Box sx={{ width: "100%", mt: 2 }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                      <Typography
                        variant="caption"
                        display="block"
                        textAlign="center"
                        mt={0.5}
                      >
                        Uploading: {uploadProgress}%
                      </Typography>
                    </Box>
                  )}

                  {preview && (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: 10,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {watch("image_url") ? "Upload successful!" : "Uploading..."}
                      </Typography>
                    </Box>
                  )}

                  {errors.image_url && (
                    <FormHelperText error>{errors.image_url.message}</FormHelperText>
                  )}
                </Box>
              </Stack>

              {/* Buttons */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >


                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#fb923c",
                    color: "#fff",
                    fontWeight: "bold",
                    px: 4,
                    "&:hover": {
                      bgcolor: "#f97316",
                    },
                    "&:disabled": {
                      bgcolor: "#ddd",
                      color: "#666",
                    },
                  }}
                  disabled={isSubmitting || (uploadProgress > 0 && uploadProgress < 100)}
                >
                  {isSubmitting ? "Submitting..." : uploadProgress > 0 && uploadProgress < 100 ? "Uploading..." : "Submit Recipe"}
                </Button>

              </Box>
            </Paper>



          </Container>

        </Box>

      </Paper>


    </Box>



  );


}
