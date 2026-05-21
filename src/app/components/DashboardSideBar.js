"use client";

import React from "react";
import {
  Drawer,
  Typography,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // for Dialog warning icon
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FoodBankIcon from '@mui/icons-material/FoodBank';

const drawerWidth = 240;

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Logout dialog state
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);
  const handleConfirmLogout = () => {
    setOpenLogoutDialog(false);
    router.push("/"); // Navigate to homepage
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#FF7B00",
          color: "#fff",
        },
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", p: 2 }}>
        CookCraft
      </Typography>
      <Toolbar />

      <Box sx={{ overflow: "auto" }}>
        <List>
          {[
            {
              text: "Dashboard",
              icon: <DashboardIcon />,
              path: "/admin/dashboard",
            },
            { text: "User", icon: <PeopleIcon />, path: "/admin/user" },
            {
              text: "Recipes",
              icon: <MenuBookIcon />,
              path: "/admin/recipe",
            },
            {
              text: "Categories",
              icon: <CategoryIcon />,
              path: "/admin/categories",
            },
            {
              text: "To Home",
              icon: <FoodBankIcon />,
              path: "/home",
            },
          ].map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link href={item.path} passHref key={item.text} legacyBehavior>
                <ListItem
                  component="a"
                  sx={{
                    textDecoration: "none",
                    backgroundColor: isActive ? "#fff" : "inherit",
                    color: isActive ? "#000" : "inherit",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                    },
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "#000" : "inherit",
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      style: {
                        textDecoration: "none",
                      },
                    }}
                  />
                </ListItem>
              </Link>
            );
          })}
          <Divider sx={{ my: 1 }} />
          {/* Logout Item */}
          <ListItem
            button
            onClick={handleOpenLogoutDialog}
            sx={{
              "&:hover": {
                backgroundColor: "#fff",
                color: "#000",
                "& .MuiListItemIcon-root": {
                  color: "#000",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>

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
          <Typography variant="body2">You want to log out?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="contained" color="error" onClick={handleCloseLogoutDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmLogout} autoFocus>
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
