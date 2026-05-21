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
  Add as AddIcon,
  Schedule as TimeIcon,
  Restaurant as CategoryIcon,
  Person as UserIcon,
  PendingActions as PendingIcon,
  Clear as RejectIcon,
} from "@mui/icons-material";
import axios from "axios";
import { usePathname } from "next/navigation";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/app/components/DashboardSideBar";
import SearchBar from "@/app/components/SearchBar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";


export default function RecipeDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [filterStatus, setFilterStatus] = useState("all");
  const statuses = ["all", "approve", "pending", "reject"];

  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredRecipes = recipes
    .filter((recipe) =>
      filterStatus === "all" || recipe.status === filterStatus
    )
    .filter((recipe) =>
      searchTerm === "" ||
      recipe.category.name.toLowerCase().includes(searchTerm) ||
      recipe.name.toLowerCase().includes(searchTerm)
    );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  const fetchRecipes = async () => {
    try {
      console.log("fetchRecipes()");
      // Adjust the API call to fetch all recipes, then filter locally
      const response = await axios.get("/api/admin/recipes");
      console.log("API response:", response);
      setRecipes(response.data.recipes || []); // Use response.data.recipes and provide fallback empty array
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      setRecipes([]); // Set to empty array on error
    }
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

  useEffect(() => {
    console.log("Recipes", recipes); // Log current recipes state
    fetchRecipes();
    getUserList();
  }, []);

  const getUsernameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Loading...";
  };

  const approvedRecipes =
    recipes?.filter((recipe) => recipe.status === "approve" || recipe.status === "reject" || recipe.status === "pending") || []; // This needs to be adjusted based on the `filterStatus` state for actual display

  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRejectClick = (recipeId) => {
    setRecipeToReject(recipeId);
    setRejectDialogOpen(true);
  };

  const handleApproveClick = async (recipeId) => {
    try {
      await axios.put(`/api/admin/recipes/${recipeId}`, {
        status: "approve",
      });

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, status: "approve" } : recipe
        )
      );

      setSnackbar({
        open: true,
        message: "Recipe approved successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to approve recipe",
        severity: "error",
      });
    }
  };


  const confirmReject = async () => {
    try {
      await axios.put(`/api/admin/recipes/${recipeToReject}`, { // Corrected endpoint for rejection
        status: "reject",
      });

      // Update local state to reflect rejection
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === recipeToReject
            ? { ...recipe, status: "reject" } // Corrected status to "reject"
            : recipe
        )
      );

      setSnackbar({
        open: true,
        message: "Recipe rejected successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to reject recipe",
        severity: "error",
      });
    } finally {
      setRejectDialogOpen(false);
    }
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
          {filteredRecipes.map((recipe) => ( // Use filteredRecipes here
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
                  color={
                    recipe.status === "approve"
                      ? "success"
                      : recipe.status === "pending"
                        ? "warning"
                        : "error"
                  }
                  size="small"
                  icon={
                    recipe.status === "approve" ? (
                      <CheckIcon />
                    ) : recipe.status === "pending" ? (
                      <PendingIcon />
                    ) : (
                      <RejectIcon />
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
                    onClick={(e) => { // Prevent opening dialog when clicking view
                      e.stopPropagation();
                      handleOpen(recipe);
                    }}
                  >
                    View
                  </Button>

                  {filterStatus === "pending" && (
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
                        e.stopPropagation();
                        console.log("Approve clicked for:", recipe.id);
                        handleApproveClick(recipe.id);
                      }}
                    >
                      Approve
                    </Button>
                  )}

                  {filterStatus !== "reject" && ( // Conditional rendering for Reject button
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
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#FF7B00" }}>
          Recipes
        </Typography>
        <Box sx={{ mb: 2 }}>
          {/* <Button
            variant={filterStatus === "All" ? "contained" : "outlined"}
            onClick={() => setFilterStatus("All")}
            sx={{mr: 1}}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "approve" ? "contained" : "outlined"}
            onClick={() => setFilterStatus("approve")}
            sx={{ mr: 1 }}
          >
            Approve
          </Button>
          <Button
            variant={filterStatus === "pending" ? "contained" : "outlined"}
            onClick={() => setFilterStatus("pending")}
            sx={{ mr: 1 }}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "reject" ? "contained" : "outlined"}
            onClick={() => setFilterStatus("reject")}
          >
            Reject
          </Button> */}

          {statuses.map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "contained" : "outlined"}
              onClick={() => setFilterStatus(status)}
              sx={{
                mr: 1,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: filterStatus === status ? '#ff6f00' : 'transparent',
                color: filterStatus === status ? 'white' : 'inherit',
                transition: 'all 0.3s ease',
                boxShadow: filterStatus === status ? 2 : 'none',
                '&:hover': {
                  backgroundColor: filterStatus === status ? '#e65100' : '#fff3e0',
                  transform: 'translateY(-3px)',
                }
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}

        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by recipe name or category..."
            variant="outlined"
            size="small"
            onChange={handleSearch}
            value={searchTerm} // Add this to make it controlled
            sx={{
              width: 300,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* <SearchBar/> */}
        </Box>

        {/* Recipe Table */}
        <Box>
          {/* Table */}
          <RecipeTable recipes={filteredRecipes} />
          {/* // Dialog  */}

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: "bold",
                fontSize: 20,
                bgcolor: "background.paper",
                color: "primary.main",
              }}
            >
              <RestaurantMenuIcon />
              {selectedRecipe?.name} Recipe Details
            </DialogTitle>

            <DialogContent dividers sx={{ px: 3, py: 2, backgroundColor: "#f9f9f9" }}>
              {/* User Info Section */}
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  backgroundColor: "white",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ display: "flex", alignItems: "center", mb: 1, color: "text.secondary" }}
                >
                  <PersonIcon sx={{ mr: 1 }} />
                  Uploaded By:
                  <Typography variant="body1" component="span" sx={{ ml: 1, fontWeight: 500 }}>
                    {getUsernameById(selectedRecipe?.user_id)}
                  </Typography>
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}
                >
                  <CategoryIcon sx={{ mr: 1 }} />
                  Category:
                  <Typography variant="body1" component="span" sx={{ ml: 1, fontWeight: 500 }}>
                    {selectedRecipe?.category.name}
                  </Typography>
                </Typography>
              </Box>

              {/* Time Info Section */}
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "primary.main",
                  }}
                >
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  Time Information
                </Typography>
                <Box ml={3}>
                  <Typography variant="body1" mb={1}>
                    <strong>Pre Cooking Time:</strong> {selectedRecipe?.pre_cooking_time}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Cooking Time:</strong> {selectedRecipe?.cooking_time}
                  </Typography>
                </Box>
              </Box>

              {/* Ingredients Section */}
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "primary.main",
                  }}
                >
                  <ChecklistIcon sx={{ mr: 1 }} />
                  Ingredients
                </Typography>
                <Typography
                  variant="body1"
                  whiteSpace="pre-line"
                  sx={{ backgroundColor: "#f1f1f1", p: 2, borderRadius: 1 }}
                >
                  {selectedRecipe?.ingredient}
                </Typography>
              </Box>

              {/* Instructions Section */}
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "primary.main",
                  }}
                >
                  <ChecklistIcon sx={{ mr: 1 }} />
                  Instructions
                </Typography>
                <Typography
                  variant="body1"
                  whiteSpace="pre-line"
                  sx={{ backgroundColor: "#f1f1f1", p: 2, borderRadius: 1 }}
                >
                  {selectedRecipe?.instruction}
                </Typography>
              </Box>

              {/* Image Section */}
              {selectedRecipe?.image_url && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "white",
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: "primary.main",
                    }}
                  >
                    <ImageIcon sx={{ mr: 1 }} />
                    Image Preview
                  </Typography>
                  <Box
                    component="img"
                    src={selectedRecipe.image_url}
                    alt={selectedRecipe.name}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: 350,
                      objectFit: "cover",
                      borderRadius: 2,
                      boxShadow: 2,
                      
                      
                    }}
                  />

                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", borderRadius: 2, color: "white" }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>



          {/* Confirmation Dialog */}
          <Dialog
            open={rejectDialogOpen}
            onClose={() => setRejectDialogOpen(false)}
          >
            <DialogTitle>Confirm Rejection</DialogTitle>
            <DialogContent>
              Are you sure you want to reject this recipe?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={confirmReject}
                sx={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#D32F2F" },
                }}
              >
                Confirm Reject
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
}