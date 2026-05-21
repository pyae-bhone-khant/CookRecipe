"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Paper,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Pagination,
} from "@mui/material";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import Badge from "@mui/material/Badge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

const groupByDate = (items) => {
  return items.reduce((acc, item) => {
    const dateKey = format(new Date(item.createdAt), "EEEE - MMMM d, yyyy");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});
};

export default function HistoryPage() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const openProfile = Boolean(anchorEl);
  const openNotification = Boolean(anchorE2);
  const handleClickProfile = (event) => setAnchorEl(event.currentTarget);
  const handleClickNotification = (event) => setAnchorE2(event.currentTarget);
  const handleCloseProfile = () => setAnchorEl(null);
  const handleCloseNotification = () => setAnchorE2(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorElMore, setAnchorElMore] = React.useState(null);
  const openMore = Boolean(anchorElMore);
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const params = useParams();
  const recipeId = params.id;

  const [histories, setHistories] = useState([]);

  useEffect(() => {
    const fetchHistories = async () => {
      const res = await fetch("/api/users/histories");
      const data = await res.json();
      setHistories(data);
    };
    fetchHistories();
  }, []);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getIcon = (action) => {
    switch (action) {
      case "created":
        return "🧾";
      case "liked":
        return "❤️";
      case "commented":
        return "💬";
      default:
        return "🔔";
    }
  };

  const handleClickMore = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorElMore(null);
  };

  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

  const handleConfirmLogout = () => {
    setOpenLogoutDialog(false);
    router.push("/");
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  // const handleConfirmDelete = () => {
  //   setOpen(false);
  //   // Handle actual delete logic
  // };
  const handleConfirmDelete = async () => {
  try {
    const res = await fetch("/api/histories/clear", {
      method: "DELETE",
    });

    if (res.ok) {
      setHistories([]); // Clear from UI
    } else {
      const error = await res.json();
      console.error("Error clearing history:", error.error);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    setOpen(false); // Close dialog
  }
};


  const handleCancel = () => {
    setOpen(false);
  };

  const notifications = [
    {
      id: 1,
      type: "comment",
      user: "Anna",
      message: "commented on your Chicken Curry Recipe Post",
      time: "12:05pm",
      avatarSrc: "/images/avatar_anna.jpg",
      isNew: true,
    },
    // ... other notifications
  ];

  return (
    <Box>
      {/* Navbar (same as before) */}

      <Navbar/>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" spacing={4}>
          {/* Sidebar */}
          <Box sx={{ width: 200 }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(255, 111, 0, 0.4)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", color: "#ff6f00" }}
              >
                History
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Button
                startIcon={<DeleteIcon />}
                sx={{
                  color: "text.secondary",
                  justifyContent: "flex-start",
                  textTransform: "none",
                  "&:hover": {
                    color: "error.main",
                    backgroundColor: "transparent",
                  },
                }}
                onClick={handleDeleteClick}
              >
                Clear history
              </Button>
            </Paper>
          </Box>

          {/* History Content */}
          <Box sx={{ flex: 1 }}>
            {/* Search Bar */}
            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <TextField
                placeholder="Search history"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  borderRadius: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                  },
                }}
              />
              {/* <Button 
                variant="contained" 
                color="warning" 
                onClick={handleDeleteClick}
                sx={{ borderRadius: 4 }}
              >
                Delete
              </Button> */}
            </Box>

            {/* History Sections */}
            <Box sx={{ mb: 4 }}>
              {/* <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                Today - Friday, July 4, 2025
              </Typography> */}
              <Divider sx={{ mb: 2, borderColor: "divider" }} />
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(255, 111, 0, 0.4)",
                  backgroundColor: "background.paper",
                }}
              >
                <List disablePadding>
                  
                  <Typography variant="h6" gutterBottom>
                    Your History
                  </Typography>
                  {histories.length === 0 ? (
                    <Typography>No history found.</Typography>
                  ) : (
                    histories.map((history) => (
                      <Card
                        key={history.id}
                        sx={{ mb: 2, backgroundColor: "#fff7ed" }}
                      >
                        <CardContent
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {formatTime(history.createdAt)}{" "}
                            {getIcon(history.action)} {history.message}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </List>
              </Paper>
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle
          sx={{ bgcolor: "orange", color: "white", textAlign: "center" }}
        >
          Warning!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography>
            Are you sure you want to clear all your history?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="outlined" onClick={handleConfirmDelete}>
            YES
          </Button>
          <Button variant="contained" color="warning" onClick={handleCancel}>
            NO
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
