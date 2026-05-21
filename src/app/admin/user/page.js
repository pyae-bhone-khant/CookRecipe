"use client";
import {
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
  IconButton,
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import {
  Search as SearchIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  ExitToApp as LogoutIcon,
  Check as CheckIcon,
  Add as AddIcon,

  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { usePathname } from 'next/navigation';

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/app/components/DashboardSideBar";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import WcIcon from '@mui/icons-material/Wc';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ImageIcon from '@mui/icons-material/Image';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// const UserTable = ({ users }) => (
//   <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: "auto" }}>
//     <Table>
//       <TableHead
//         sx={{
//           position: "sticky",
//           top: 0,
//           zIndex: 1,
//           backgroundColor: "#f5f5f5", // header background (important for sticky effect)
//         }}
//       >
//         <TableRow>
//           <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
//           <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
//           <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
//           <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody sx={{ maxHeight: 100, overflowY: "auto", pr: 1 }}>
//         {users.map((user, index) => (
//           <TableRow key={user.id} hover>
//             <TableCell>{index + 1}</TableCell>
//             <TableCell>{user.username}</TableCell>
//             <TableCell>{user.email}</TableCell>
//             <TableCell>
//               <Link href={`/users/${user.id}`} passHref>
//                 <IconButton>
//                   <VisibilityIcon />
//                 </IconButton>
//               </Link>
//               <IconButton>
//                 <DeleteIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// );

const UserTable = ({ users, onDelete, onView }) => (
  <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: "auto" }}>
    <Table>
      <TableHead
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id} hover>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>

              <IconButton onClick={() => onView(user)} color="primary">
                <VisibilityIcon />
              </IconButton>

              <IconButton onClick={() => onDelete(user.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);


export default function UserAdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); // Remove from UI
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
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
    console.log("Users", users);

    getUserList();
  }, []);

  //Search filter
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)

    );
  }, [searchTerm, users]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#fafafa" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#FF7B00" }}>
            Users
          </Typography>
          <TextField
            placeholder="Search approved recipes..."
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
        </Box>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{ display: "flex", alignItems: "center", }}
          >
            {/* <PeopleIcon sx={{ mr: 1, color: "#FF7B00" }} /> */}
            User Details
          </DialogTitle>
          <Divider sx={{ mb: 2 }} />

          <DialogContent>
            {selectedUser ? (
              <Box>
                {/* Cover Image Full Width */}
                <Box
                  sx={{
                    position: "relative",
                    height: 200,
                    width: "100%",
                    // borderRadius: 2,
                    // overflow: "hidden",
                    mb: 6,

                  }}
                >
                  <Box
                    component="img"
                    src={selectedUser.coverImage}
                    alt="Cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 2,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      boxShadow: 1,
                    }}
                  />

                  {/* Profile Image on Center */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -50,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "4px solid white",
                      boxShadow: 3,
                      backgroundColor: "#fff",

                    }}
                  >
                    <Box
                      component="img"
                      src={selectedUser.image_url}
                      alt="Profile"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",

                      }}
                    />
                  </Box>
                </Box>

                {/* User Info */}
                <Box sx={{ mt: 6 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <PeopleIcon sx={{ mr: 1, color: "#FF7B00" }} />
                    User Information
                  </Typography>

                  <Divider sx={{ mb: 3 }} />

                  <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", sm: "1fr 2fr" }}
                    gap={2}
                    sx={{ mb: 2 }}
                  >
                    <Typography fontWeight="bold">
                      <AccountCircleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      Username:
                    </Typography>
                    <Typography>{selectedUser.username}</Typography>

                    <Typography fontWeight="bold">
                      <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      Email:
                    </Typography>
                    <Typography>{selectedUser.email}</Typography>

                    <Typography fontWeight="bold">
                      <AdminPanelSettingsIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      Role:
                    </Typography>
                    <Typography>{selectedUser.role}</Typography>

                    <Typography fontWeight="bold">
                      <PhoneIphoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      Phone:
                    </Typography>
                    <Typography>{selectedUser.phone}</Typography>

                    <Typography fontWeight="bold">
                      <WcIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      Gender:
                    </Typography>
                    <Typography>{selectedUser.gender}</Typography>

                    <Typography fontWeight="bold">
                      <CalendarMonthIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      Birthdate:
                    </Typography>
                    <Typography>{selectedUser.birthdate}</Typography>

                    <Typography fontWeight="bold">
                      <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      Created At:
                    </Typography>
                    <Typography>
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography>No user selected.</Typography>
            )}
          </DialogContent>




          <DialogActions>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", borderRadius: 2, color: "white" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>



        <Paper elevation={3} sx={{ p: 2 }}>
          <UserTable users={filteredUsers} onDelete={handleDelete} onView={handleView} />
        </Paper>

      </Box>
    </Box>
  );
}


