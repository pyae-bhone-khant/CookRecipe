

"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  Typography,
  Badge,
  CircularProgress,
  IconButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());


  const open = Boolean(anchorEl);

  // Fetch notifications from API
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/notifications");
      const fetchedNotifications = response.data.notifications || [];
      setNotifications(fetchedNotifications);

      // Filter only messages newer than lastCheckedTime
      const unreadNew = fetchedNotifications.filter(
        (n) => new Date(n.createdAt) > lastCheckedTime
      ).length;

      setNewNotificationCount(unreadNew);
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle click
 
  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    setHasOpened(true);
    await fetchNotifications();

    // Reset badge count when opening the menu
    setNewNotificationCount(0);
    // setLastCheckedTime(new Date());
  };


  const handleClose = () => {
    setAnchorEl(null);
    setNewNotificationCount(0);
    setLastCheckedTime(new Date());
  };

  // Poll for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) {
        fetchNotifications();
      }
    }, 10000);

    // Initial fetch
    fetchNotifications();

    return () => clearInterval(interval);
  }, [open, lastCheckedTime, hasOpened]);

  return (
    <>
      {/* <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
        sx={{
          p: 0,
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        
        <Badge
          badgeContent={newNotificationCount}
          color="error"
          invisible={newNotificationCount === 0}
        >

          <Avatar
            sx={{
              bgcolor: "#F57C00",
              cursor: "pointer",
              transition: "transform 0.3s",
              "&:hover": {
                backgroundColor: "#e86f00",
                transform: "translateY(-3px)",
              },
            }}
          >
            <NotificationsIcon />
          </Avatar>
        </Badge>
      </IconButton> */}

      <IconButton
  color="inherit"
  onClick={handleClick}
  aria-label="notifications"
  sx={{
    p: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  }}
>
  <Badge
    badgeContent={newNotificationCount > 0 ? newNotificationCount : null}
    color="error"
    invisible={newNotificationCount === 0}
  >
    <Badge
      color="error"
      variant="dot"
      invisible={newNotificationCount === 0}
      overlap="circular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Avatar
        sx={{
          bgcolor: "#10B981",
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:hover": {
            backgroundColor: "#059669",
            transform: "translateY(-3px)",
          },
        }}
      >
        <NotificationsIcon />
      </Avatar>
    </Badge>
  </Badge>
</IconButton>


      <Menu
        sx={{
          p: 2,
          minWidth: 300,
          "& .MuiPaper-root": {
            maxHeight: 400,
          }
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box>
          {loading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Typography color="error" p={2}>
              {error}
            </Typography>
          ) : notifications.length === 0 ? (
            <Typography color="text.secondary" p={2}>
              No notifications
            </Typography>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                    <Avatar
                      src={notification.avatarSrc || "https://via.placeholder.com/40"}
                      sx={{ width: 36, height: 36, mr: 1.5 }}
                    />

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Red dot for new notifications */}
                    {!notification.is_read && new Date(notification.createdAt) > lastCheckedTime && (
                      <Badge
                        color="error"
                        variant="dot"
                        sx={{
                          ml: 1,
                          "& .MuiBadge-badge": {
                            height: 8,
                            minWidth: 8,
                            borderRadius: "50%",
                          },
                        }}
                      />
                    )}
                  </Box>
                </MenuItem>
                {index !== notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </Box>
      </Menu>
    </>
  );
};

export default NotificationMenu;

 






