"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import NProgress from "nprogress";
import { notifications } from "../data"; //app/data using alias
import NotificationMenu from "./NotificationMenu"; // or "@/components/NotificationMenu"
import { RocketLaunch } from "@mui/icons-material";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Check if route is active
  const isActive = (path) => {
    if (path === '/home') {
      return pathname === '/home' || pathname === '/';
    }
    return pathname === path;
  };

  // Navigation loading
  const handleNavigate = (path) => {
    NProgress.start();
    router.push(path);
  };

  // Profile menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openProfile = Boolean(anchorEl);
  const handleClickProfile = (event) => setAnchorEl(event.currentTarget);
  const handleCloseProfile = () => setAnchorEl(null);

  // Notification menu
  const [anchorE2, setAnchorE2] = React.useState(null);
  const openNotification = Boolean(anchorE2);
  const handleClickNotification = (event) => setAnchorE2(event.currentTarget);
  const handleCloseNotification = () => setAnchorE2(null);

  // More menu
  const [anchorElMore, setAnchorElMore] = React.useState(null);
  const openMore = Boolean(anchorElMore);
  const handleClickMore = (event) => setAnchorElMore(event.currentTarget);
  const handleCloseMore = () => setAnchorElMore(null);

  // Logout dialog
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

  const handleConfirmLogout = async () => {
    setOpenLogoutDialog(false);
    await signOut({ redirect: false });
    handleNavigate("/");
  };


  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'rgba(250, 248, 245, 0.8)', color: 'text.primary', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 118, 34, 0.08)', boxShadow: '0 8px 32px rgba(255, 118, 34, 0.04)' }}>
      <Toolbar sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            cursor: 'pointer', // 🖱 cursor pointer so user knows it's clickable
          }}
          onClick={() => handleNavigate('/home')} // 👉 Add this line
        >
          COOKCRAFT
        </Typography>


        {/* Navigation Links */}
        <Box>
          <Button
            onClick={() => handleNavigate('/home')}
            sx={{
              color: isActive('/home') ? 'primary.main' : 'text.primary',
              mx: 1,
              // fontWeight: isActive('/home') ? 'normal' : 'normal',
              transition: 'transform 0.3s',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
                transform: 'translateY(-3px)',
              },
            }}
          >
            Home
          </Button>

          <Button
            onClick={() => handleNavigate('/recipes')}
            sx={{
              color: isActive('/recipes') ? 'primary.main' : 'text.primary',
              mx: 1,
              // fontWeight: isActive('/recipes') ? 'bold' : 'normal',
              transition: 'transform 0.3s',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
                transform: 'translateY(-3px)',
              },
            }}
          >
            Recipes
          </Button>

          <Button
            onClick={() => handleNavigate('/about')}
            sx={{
              color: isActive('/about') ? 'primary.main' : 'text.primary',
              mx: 1,
              // fontWeight: isActive('/about') ? 'bold' : 'normal',
              transition: 'transform 0.3s',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
                transform: 'translateY(-3px)',
              },
            }}
          >
            About
          </Button>

          <Button
            onClick={() => handleNavigate('/contact')}
            sx={{
              color: isActive('/contact') ? 'primary.main' : 'text.primary',
              mx: 1,
              // fontWeight: isActive('/contact') ? 'bold' : 'normal',
              transition: 'transform 0.3s',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
                transform: 'translateY(-3px)',
              },
            }}
          >
            Contact Us
          </Button>
        </Box>

        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

          {/* + create */}
          {pathname !== "/recipes/create" && (
            <Button
              onClick={() => handleNavigate('/recipes/create')}
              variant="contained"
              color="primary"
              startIcon={
                <Box
                  sx={{
                    backgroundColor: "white",
                    color: "primary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    fontSize: "16px",
                  }}
                >
                  <AddIcon fontSize="inherit" />
                </Box>
              }
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                paddingY: "6px",
                paddingX: "16px",
                fontSize: "16px",
                fontWeight: 500,
                transition: 'transform 0.3s',
                "&:hover": {
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Create Post
            </Button>
          )}


          {/* Notification */}
          <NotificationMenu />

          {/* Profile Avatar */}
          <Avatar
            onClick={() => handleNavigate('/profile')}
            src={user?.image_url || undefined}
            sx={{
              bgcolor: user?.image_url ? 'transparent' : '#ff7f00',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              width: 40,
              height: 40,
              "&:hover": {
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 12px rgba(255, 111, 0, 0.4)',
              },
            }}
          >
            {!user?.image_url && (user?.username?.charAt(0) || session?.user?.username?.charAt(0) || 'U')}
          </Avatar>

          {/* More Menu */}
          <IconButton color="inherit" onClick={handleClickMore}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElMore}
            open={openMore}
            onClose={handleCloseMore}
            PaperProps={{
              elevation: 4,
              sx: {
                borderRadius: 2,
                mt: 1,
                minWidth: 180,
                bgcolor: "white",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                handleCloseMore();
                handleNavigate('/profile/edit-profile');
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#ff9f00",
                },
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMore();
                handleNavigate('/history');
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#ff9f00",
                },
              }}
            >
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="History" />
            </MenuItem>
            {user?.role === 'admin' && (
              <MenuItem
              onClick={() => {
                handleCloseMore();
                handleNavigate('/admin/dashboard');
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#ff9f00",
                },
              }}
            >
              <ListItemIcon>
                <RocketLaunch fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </MenuItem>
            )}
            <Divider />
            <MenuItem
              onClick={() => {
                handleCloseMore();
                handleOpenLogoutDialog();
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#ff9f00",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>

          {/* Logout Dialog */}
          <Dialog
            open={openLogoutDialog}
            onClose={handleCloseLogoutDialog}
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
          >
            <DialogTitle id="logout-dialog-title" sx={{ textAlign: "center" }}>
              <WarningAmberIcon sx={{ color: "#ff7f00", fontSize: 50 }} />
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Are you sure?
              </Typography>
              <Typography variant="body2">
                You want to log out?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseLogoutDialog}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmLogout}
                autoFocus
                sx={{ color:'white' }}
              >
                Log Out
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
