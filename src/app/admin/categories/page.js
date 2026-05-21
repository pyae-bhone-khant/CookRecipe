

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TextField,
  Button,
  Snackbar,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  CircularProgress,
  Container,
} from "@mui/material";
import axios from "axios";
// import { DashboardSidebar } from "@/app/components/dashboardSideBar";

import { DashboardSidebar } from "@/app/components/DashboardSideBar";


export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Edit handler
  const handleEditClick = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  // Save edited category
  const handleSave = async (id) => {
    try {
      await axios.put(`/api/admin/categories/${id}`, { name: editName });
      setEditingId(null);
      setEditName("");
      fetchCategories(); // refresh list
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update category");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/admin/categories", { name });
      setSuccess(true);
      setName("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box>
      <DashboardSidebar />

      <Box maxWidth="sm" mx="auto" mt={5}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" mb={3}>
            Add New Category
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Category Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button variant="contained" type="submit" fullWidth
              sx={{
                backgroundColor: '#ff6f00',
                color: "white",
              }}
            >
              Add Category
            </Button>
          </form>
        </Paper>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          message="Category added successfully"
        />
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError("")}
          message={error}
        />
      </Box>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Category List
          </Typography>

          {loading ? (
            <Box textAlign="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", }} >
                    No</TableCell>
                  <TableCell sx={{ fontWeight: "bold", }}>
                    Category Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", }}>
                    Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>{index + 1}</TableCell>
                    {/* <TableCell>{category.name}</TableCell> */}

                    <TableCell>
                      {editingId === category.id ? (
                        <TextField
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          fullWidth
                          size="small"
                        />
                      ) : (
                        category.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === category.id ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleSave(category.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            color: "white",
                            backgroundColor: "#c3c0bdff",
                            transition: "all 0.3s ease",
                            "&:hover": { backgroundColor: "#c4c4c4ff" },
                            transform: "translateY(-3px)",
                          }}
                          onClick={() => handleEditClick(category)}
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
