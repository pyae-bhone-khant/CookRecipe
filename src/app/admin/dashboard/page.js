"use client";
import {
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Snackbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  ExitToApp as LogoutIcon,
  Check as CheckIcon,
  MoreHoriz as MoreIcon,
  Notifications as PendingIcon,
} from "@mui/icons-material";
import Link from "next/link";
import axios from "axios";

import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import { useRouter } from "next/navigation";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,

  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import React, { useEffect, useState, useMemo } from "react";
import { DashboardSidebar } from "@/app/components/DashboardSideBar";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [recipeToReject, setRecipeToReject] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });




  // For Reject
  const confirmReject = async () => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeToReject}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "reject" }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update recipe status");
      }
      // Update local state to reflect rejection
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === recipeToReject
            ? { ...recipe, status: "reject" }
            : recipe
        )
      );
      setSnackbar({
        open: true,
        message:
          "Recipe rejected successfully and notification created",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to reject recipe: ${error.message}`,
        severity: "error",
      });
    } finally {
      setRejectDialogOpen(false);
    }
  };

  //For Approve
  const handleApprove = async (recipeId) => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approve" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update recipe status");
      }

      // API response ထဲမှာ အသစ် update ပြီး recipe data ရှိမရှိစစ်ပါ
      const approvedRecipe = result.data; // ဒါမှမဟုတ် result.recipe

      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, status: "approve" } : recipe
        )
      );

      if (approvedRecipe) {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: approvedRecipe.user_id,
            message: `Your recipe "${approvedRecipe.name}" has been approved!`,
          }),
        });
      }

      setSnackbar({
        open: true,
        message: "Recipe status updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Update failed:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  // handleRejectClick
  const handleRejectClick = async (recipeId) => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "reject" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update recipe status");
      }

      const rejectedRecipe = result.data;

      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, status: "rejected" } : recipe
        )
      );

      if (rejectedRecipe) {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: rejectedRecipe.user_id,
            message: `Your recipe "${rejectedRecipe.name}" has been rejected.`,
          }),
        });
      }

      setSnackbar({
        open: true,
        message: "Recipe rejected successfully.",
        severity: "info", // or "warning"
      });
    } catch (error) {
      console.error("Reject failed:", error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };


  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUserList = async () => {
    try {
      console.log("getUserList()");
      const response = await axios.get("/api/admin/users");
      console.log("API response:", response);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };


  const getRecipeList = async () => {
    try {
      const response = await axios.get("/api/admin/recipes");
      console.log("API response:", response);

      const recipes = response.data.recipes;
      console.log("API response data:", response.data);



      recipes.map((r) =>
        console.log("Recipe:", `name=${r.name}, createdAt =${r.createdAt}, status=${r.status}`)
      );


      setRecipes(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };


  const [categories, setCategories] = useState([]);


  const getCategories = async () => {
    try {
      const response = await axios.get("/api/admin/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };


  useEffect(() => {
    console.log("Users", recipes);
    getUserList();
    getRecipeList();
    getCategories();
  }, []);

  useEffect(() => {
    console.log("Recipes", recipes.map(r => [r.name, r.createdAt, r.status]));
  }, [recipes]);


  const monthlyRecipeCounts = useMemo(() => {
    const counts = {};
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1); // ပြီးခဲ့သည့် ၆ လစာအတွက်

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];


    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(monthNames[d.getMonth()]);
      counts[monthNames[d.getMonth()]] = 0; // default count ကို 0 ထားပါ
    }



    recipes.forEach((recipe) => {
      if (!recipe.createdAt) return; // undefined ဖြစ်ရင် skip
      const recipeDate = new Date(recipe.createdAt);
      if (
        recipeDate >= sixMonthsAgo &&
        (recipe.status === "approve" || recipe.status === "approved")
      ) {
        const monthName = monthNames[recipeDate.getMonth()];
        counts[monthName] = (counts[monthName] || 0) + 1;
      }
    });




    return {
      labels: labels,
      data: labels.map(label => counts[label]),
    };
  }, [recipes]);




  const categoryCounts = useMemo(() => {
    const counts = {};
    recipes.forEach((recipe) => {
      const categoryName = recipe.category?.name || "Unknown";
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    });
    return counts;
  }, [recipes]);


  const filteredRecipes = (recipes || [])
    .filter((recipe) => recipe.status === "pending")
    .filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchTerm)
      //recipe.user_id.toLowerCase().includes(searchTerm) ||
      //recipe.category.toLowerCase().includes(searchTerm)
    );

  const getUsernameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Loading...";
  };

  const RecipeTable = ({ recipes }) => (
    <TableContainer
      component={Paper}
      sx={{
        height: 500,
        overflow: "auto",
        position: "relative",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell
              sx={{
                fontWeight: "bold",
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 2,
              }}
            >
              Recipe Title
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 2,
              }}
            >
              Uploaded By
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 2,
              }}
            >
              Category
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 2,
              }}
            >
              Image
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 2,
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 2,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow
              key={recipe.id}
              hover
              onClick={() => handleOpen(recipe)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell sx={{ fontWeight: "medium" }}>{recipe.name}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getUsernameById(recipe.user_id)}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {recipe.category.name}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {recipe.image_url && (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={recipe.status}
                  color={recipe.status === "approved" ? "success" : "warning"}
                  size="small"
                  icon={
                    recipe.status === "pending" ? (
                      <PendingIcon />
                    ) : (
                      <CheckIcon />
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Box display="flex">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#aebcaeff", // Green
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#aebcaeff", // Darker green on hover
                      },
                      textTransform: "none",
                      mr: 2,
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#388E3C" },
                      textTransform: "none",
                      mr: 2,
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleApprove(recipe.id);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#f44336",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#D32F2F" },
                      textTransform: "none",
                      mr: 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectClick(recipe.id);
                    }}
                  >
                    Reject
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );


  const recipesData = {
    labels: monthlyRecipeCounts.labels,
    datasets: [
      {
        label: "Recipes Published",
        data: monthlyRecipeCounts.data,
        backgroundColor: "rgba(63, 81, 181, 0.8)", // Bar color ကို ပြောင်းပါ
        borderColor: "rgba(63, 81, 181, 1)",
        borderWidth: 1,
      },
    ],
  };


  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#AB47BC", "#FFA726",
          "#26C6DA", "#EF5350", "#66BB6A", "#FF7043", // More colors if needed
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };


  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#fafafa" }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold", color: "#FF7B00" }}
        >
          Welcome, AdminDashboard!
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          {[
            {
              title: "Total User",
              count: `${users.length}`,
              color: "primary.main",
              image: "/images/group 1.png",
            },
            {
              title: "Total Recipes",
              count: `${recipes.length}`,
              color: "secondary.main",
              image: "/images/group 3.png",
            },
            {
              title: "New Pending Recipes",
              count: `${filteredRecipes.length}`,
              color: "warning.main",
              image: "/images/group 2.png",
            },
          ].map((item, index) => (
            <Box key={index} sx={{ flex: "1 1 30%", minWidth: 250 }}>
              <Card elevation={3}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <img src={item.image} alt="icon" width={32} height={32} />
                    <Typography variant="subtitle1">{item.title}</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: item.color }}
                  >
                    {item.count}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 4,
            alignItems: "stretch",
          }}
        >
          <Box sx={{ flex: "1 1 65%", minWidth: 300 }}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Recipes Published
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar
                  data={recipesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,

                    // plugins: { legend: { position: "top" } },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top'
                      },
                    },

                    // scales: { y: { beginAtZero: true } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          maxTicksLimit: 20,
                          callback: function (value) {
                            // Step 1: 0 - 10 
                            if (value >= 0 && value <= 10) {
                              return value;
                            }

                            // Step 2: Thresholds
                            const thresholds = [10, 20, 30, 50, 100, 150, 200];

                            // Show only value+ if value > 10
                            if (thresholds.includes(value)) {
                              return `${value}+`;
                            }

                            // Don't show anything for other values to reduce clutter
                            return null;
                          }
                        }
                      }
                    }




                  }}
                />
              </Box>
            </Paper>
          </Box>
          <Box sx={{ flex: "1 1 30%", minWidth: 250 }}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Category
              </Typography>
              <Box sx={{ height: 300 }}>


                <Pie
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />

              </Box>
            </Paper>
          </Box>
        </Box>


      </Box>
    </Box>
  );
}
