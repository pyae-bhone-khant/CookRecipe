"use client";

import React from "react";
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
  Container,
  Stack,
  TextField,
  InputAdornment,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Chip,
  ListItemIcon, ListItemText, Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from "@mui/material";

import { useRouter } from "next/navigation";
import Link from 'next/link'; // Next.js ရဲ့ Link component

import { useState } from "react";
import Badge from "@mui/material/Badge";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import Navbar from "../components/Navbar";

export default function About() {

  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const openProfile = Boolean(anchorEl);
  const openNotification = Boolean(anchorE2);
  const handleClickProfile = (event) => setAnchorEl(event.currentTarget);
  const handleClickNotification = (event) => setAnchorE2(event.currentTarget);
  const handleCloseProfile = () => setAnchorEl(null);
  const handleCloseNotification = () => setAnchorE2(null);
  const [currentPage, setCurrentPage] = useState(2);

  // navbar more
  const [anchorElMore, setAnchorElMore] = React.useState(null);
  const openMore = Boolean(anchorElMore);

  const handleClickMore = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorElMore(null);
  };

  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

  const handleConfirmLogout = () => {
    setOpenLogoutDialog(false);
    console.log("User confirmed log out");
    router.push("/");

  };



  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* about */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 8, maxWidth: "1200px", mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 6,
          }}
        >

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              color="#ff7b00"
              fontWeight={700}
              gutterBottom
            >
              About CookCraft
            </Typography>

            <Typography variant="body1" sx={{ mb: 5, lineHeight: 1.8 }}>
              CookCraft is developed by a passionate team of developers,
              designers, and food enthusiasts who understand the everyday
              challenges of deciding what to cook. We aim to bridge the
              gap between technology and daily cooking by offering a smart,
              ingredient-based platform. Our mission is to reduce food waste,
              simplify meal planning, and promote healthier eating by connecting
              people through cooking.
            </Typography>

            {/* Quote and Image Row */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 4,
                mb: 6,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#ff7b00",
                    },
                  }}
                >
                  “Every dish we create is a journey of learning, capturing the
                  spirit, taste, and teamwork of student chefs.”
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  — CookCraft Team
                </Typography>
              </Box>

              <Box
                component="img"
                src="/images/food1.jpg"
                alt="CookCraft Team"
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  height: "200px",
                   objectFit:'cover',
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 20px rgba(255, 123, 0, 0.4)",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 4,
                mb: 6,
              }}
            >

              <Box
                component="img"
                src="/images/food-background.jpg"
                alt="CookCraft Team"
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "200px",
                  borderRadius: 2,
                  boxShadow: 3,
                  objectFit:'cover',
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 20px rgba(255, 123, 0, 0.4)",
                  },
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#ff7b00",
                    },
                  }}
                >
                  “CookCraft is built by a team of developers, designers, and food lovers to make everyday cooking easier. Our platform connects people through smart, ingredient-based recipes — helping reduce food waste, simplify meal planning, and support healthier eating.”
                </Typography>

              </Box>
            </Box>

            {/* The Team */}
            <Typography
              variant="h5"
              color="#ff7b00"
              fontWeight={700}
              gutterBottom
            >
              Meet the Team
            </Typography>
            <Typography variant="body1" sx={{ mb: 5, lineHeight: 1.8 }}>
              Behind every recipe is a dedicated team of passionate students —
              developers, cooks, and designers — working together to make food
              come alive online. From kitchen experiments to user-friendly UI,
              we craft every detail with love, skill, and creativity. We believe
              food is a universal language, and we’re here to help everyone speak it.
            </Typography>

            {/* Stats Section */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "space-between",
              }}
            >
              {[
                {
                  icon: <EmojiEventsIcon fontSize="large" color="warning" />,
                  value: "100+",
                  label: "Tested Recipes",
                  desc: "Created and refined by student cooks.",
                },
                {
                  icon: <MenuBookIcon fontSize="large" color="success" />,
                  value: "50+",
                  label: "User-Posted Recipes",
                  desc: "Shared by our growing foodie community.",
                },
                {
                  icon: <GroupIcon fontSize="large" color="info" />,
                  value: "5+",
                  label: "Students",
                  desc: "Collaborating on food innovation.",
                },
                {
                  icon: <SchoolIcon fontSize="large" color="secondary" />,
                  value: "2+",
                  label: "Mentors",
                  desc: "Guiding the team with expert advice.",
                },
              ].map((stat, index) => (

                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    flex: "1 1 260px",
                    p: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 4px 12px rgba(255, 111, 0, 0.9)",
                    },
                  }}
                >
                  {stat.icon}
                  <Typography variant="h6" fontWeight={700} mt={1}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.desc}
                  </Typography>
                </Paper>


              ))}
            </Box>
          </Box>
        </Box>
      </Box>



    </Box>
  );
};






// "use client";

// import React from "react";
// import {
//     AppBar,
//     Toolbar,
//     Typography,
//     Box,
//     IconButton,
//     Button,
//     Avatar,
//     Menu,
//     MenuItem,
//     Container,
//     Stack,
//     TextField,
//     InputAdornment,
//     Paper,
//     Card,
//     CardMedia,
//     CardContent,
//     Chip,
//     ListItemIcon, ListItemText, Divider,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
// } from "@mui/material";

// import { useRouter } from "next/navigation";
// import Link from 'next/link';
// import MenuIcon from "@mui/icons-material/Menu";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import SearchIcon from "@mui/icons-material/Search";
// import EditIcon from "@mui/icons-material/Edit";
// import HistoryIcon from "@mui/icons-material/History";
// import LogoutIcon from "@mui/icons-material/Logout";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import Slider from "react-slick";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import StarIcon from "@mui/icons-material/Star";
// import { useState } from "react";
// import Badge from "@mui/material/Badge";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AddIcon from '@mui/icons-material/Add';
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import GroupIcon from "@mui/icons-material/Group";
// import SchoolIcon from "@mui/icons-material/School";

// export default function About() {
//     const router = useRouter();

//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const [anchorE2, setAnchorE2] = React.useState(null);
//     const openProfile = Boolean(anchorEl);
//     const openNotification = Boolean(anchorE2);
//     const handleClickProfile = (event) => setAnchorEl(event.currentTarget);
//     const handleClickNotification = (event) => setAnchorE2(event.currentTarget);
//     const handleCloseProfile = () => setAnchorEl(null);
//     const handleCloseNotification = () => setAnchorE2(null);
//     const [currentPage, setCurrentPage] = useState(2);

//     // navbar more
//     const [anchorElMore, setAnchorElMore] = React.useState(null);
//     const openMore = Boolean(anchorElMore);

//     const handleClickMore = (event) => {
//         setAnchorElMore(event.currentTarget);
//     };

//     const handleCloseMore = () => {
//         setAnchorElMore(null);
//     };

//     const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

//     const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
//     const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

//     const handleConfirmLogout = () => {
//         setOpenLogoutDialog(false);
//         console.log("User confirmed log out");
//         router.push("/");
//     };

//     // Sample notification data
//     const notifications = [
//         {
//             id: 1,
//             type: "comment",
//             user: "Anna",
//             message: "commented on your Chicken Curry Recipe Post",
//             time: "12:05pm",
//             avatarSrc: "/images/avatar_anna.jpg",
//             isNew: true,
//         },
//         {
//             id: 2,
//             type: "like",
//             user: "Myat Noe",
//             message: "liked your Chicken Curry Recipe Post",
//             time: "10:00am",
//             avatarSrc: "/images/avatar_myatnoe.jpg",
//             isNew: true,
//         },
//         {
//             id: 3,
//             type: "comment",
//             user: "Myat Noe",
//             message: "commented your Chicken Curry Recipe Post",
//             time: "9:50am",
//             avatarSrc: "/images/avatar_myatnoe.jpg",
//             isNew: true,
//         },
//         {
//             id: 4,
//             type: "warning",
//             message:
//                 "Warning from Admin: Your [comment] violates our community guidelines.",
//             time: "9:10am",
//             isNew: false,
//         },
//     ];

//     return (
//         <Box sx={{ backgroundColor: 'white' }}>
//             {/* Navbar */}
//             <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 4px 12px rgba(255, 111, 0, 0.2)' }}>
//                 <Toolbar sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
//                     <Typography variant="h6" sx={{ color: '#ff6f00', fontWeight: 'bold' }}>
//                         COOKCRAFT
//                     </Typography>

//                     <Box>
//                         <Link href="/home" passHref>
//                             <Button sx={{
//                                 color: 'black',
//                                 mx: 1,
//                                 transition: 'transform 0.3s',
//                                 '&:hover': {
//                                     color: '#ff6f00',
//                                     transform: 'translateY(-3px)',
//                                 }
//                             }}>Home</Button>
//                         </Link>
//                         <Link href="/recipes" passHref>
//                             <Button sx={{
//                                 color: 'black', mx: 1,
//                                 transition: 'transform 0.3s',
//                                 '&:hover': {
//                                     color: '#ff6f00',
//                                     transform: 'translateY(-3px)',
//                                 }
//                             }}>Recipes</Button>
//                         </Link>
//                         <Link href="/about" passHref>
//                             <Button sx={{
//                                 color: '#ff6f00', mx: 1,
//                                 fontWeight: 'bold',
//                                 '&:hover': {
//                                     transform: 'translateY(-3px)',
//                                 }
//                             }}>About</Button>
//                         </Link>
//                         <Link href="/contact" passHref>
//                             <Button sx={{
//                                 color: 'black', mx: 1,
//                                 transition: 'transform 0.3s',
//                                 '&:hover': {
//                                     color: '#ff6f00',
//                                     transform: 'translateY(-3px)',
//                                 }
//                             }}>Contact Us</Button>
//                         </Link>
//                     </Box>

//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                         <Link href="/recipes/create" passHref>
//                             <Button
//                                 variant="outlined"
//                                 startIcon={
//                                     <Box
//                                         sx={{
//                                             backgroundColor: "white",
//                                             color: "#ff7f00",
//                                             borderRadius: "50%",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             width: 20,
//                                             height: 20,
//                                             fontSize: "16px",
//                                         }}
//                                     >
//                                         <AddIcon fontSize="inherit" />
//                                     </Box>
//                                 }
//                                 sx={{
//                                     textTransform: "none",
//                                     backgroundColor: "#ff7f00",
//                                     color: "white",
//                                     borderRadius: "20px",
//                                     paddingY: "6px",
//                                     paddingX: "16px",
//                                     fontSize: "16px",
//                                     fontWeight: 500,
//                                     transition: 'transform 0.3s',
//                                     "&:hover": {
//                                         backgroundColor: "#e86f00",
//                                         transform: 'translateY(-3px)',
//                                     },
//                                 }}
//                             >
//                                 Create Post
//                             </Button>
//                         </Link>

//                         <Avatar
//                             sx={{
//                                 bgcolor: "#F57C00", cursor: "pointer",
//                                 transition: 'transform 0.3s',
//                                 "&:hover": {
//                                     backgroundColor: "#e86f00",
//                                     transform: 'translateY(-3px)',
//                                 },
//                             }}
//                             onClick={handleClickNotification}
//                         >
//                             <NotificationsIcon />
//                         </Avatar>
//                         <Menu
//                             sx={{
//                                 p: 2,
//                                 minWidth: 300,
//                             }}
//                             anchorEl={anchorE2}
//                             open={openNotification}
//                             onClose={handleCloseNotification}
//                         >
//                             <Box>
//                                 {notifications.map((notification, index) => [
//                                     <MenuItem
//                                         key={`item-${notification.id}`}
//                                         onClick={handleClickNotification}
//                                         sx={{
//                                             "&:hover": {
//                                                 backgroundColor: "#ff9f00",
//                                             },
//                                         }}
//                                     >
//                                         <Box
//                                             sx={{
//                                                 display: "flex",
//                                                 alignItems: "flex-start",
//                                                 width: "100%",
//                                             }}
//                                         >
//                                             {notification.type !== "warning" ? (
//                                                 <Avatar
//                                                     src={
//                                                         notification.avatarSrc ||
//                                                         "https://via.placeholder.com/40"
//                                                     }
//                                                     sx={{ width: 36, height: 36, mr: 1.5 }}
//                                                 />
//                                             ) : (
//                                                 <Box
//                                                     sx={{
//                                                         display: "flex",
//                                                         alignItems: "center",
//                                                         justifyContent: "center",
//                                                         width: 36,
//                                                         height: 36,
//                                                         mr: 1.5,
//                                                         bgcolor: "#fff3e0",
//                                                         borderRadius: "50%",
//                                                     }}
//                                                 >
//                                                     <NotificationsIcon color="warning" />
//                                                 </Box>
//                                             )}

//                                             <Box sx={{ flexGrow: 1 }}>
//                                                 <Typography variant="body2">
//                                                     {notification.type === "comment" ||
//                                                         notification.type === "like" ? (
//                                                         <>
//                                                             <Typography
//                                                                 component="span"
//                                                                 sx={{ fontWeight: "bold" }}
//                                                             >
//                                                                 {notification.user}
//                                                             </Typography>{" "}
//                                                             {notification.message}
//                                                         </>
//                                                     ) : (
//                                                         <Typography
//                                                             component="span"
//                                                             sx={{ color: "text.secondary" }}
//                                                         >
//                                                             {notification.message}
//                                                         </Typography>
//                                                     )}
//                                                 </Typography>
//                                                 <Typography variant="caption" color="text.secondary">
//                                                     {notification.time}
//                                                 </Typography>
//                                             </Box>

//                                             {notification.isNew && (
//                                                 <Badge
//                                                     color="error"
//                                                     variant="dot"
//                                                     sx={{
//                                                         ml: 1,
//                                                         "& .MuiBadge-badge": {
//                                                             height: 8,
//                                                             minWidth: 8,
//                                                             borderRadius: "50%",
//                                                         },
//                                                     }}
//                                                 />
//                                             )}
//                                         </Box>
//                                     </MenuItem>,
//                                     index !== notifications.length - 1 && (
//                                         <Divider key={`divider-${notification.id}`} />
//                                     ),
//                                 ])}
//                             </Box>
//                         </Menu>

//                         <Link href="/profile" passHref style={{ textDecoration: 'none' }}>
//                             <Avatar sx={{
//                                 bgcolor: '#ff7f00', cursor: 'pointer',
//                                 transition: 'transform 0.3s',
//                                 "&:hover": {
//                                     backgroundColor: "#e86f00",
//                                     transform: 'translateY(-3px)',
//                                 },
//                             }}>K</Avatar>
//                         </Link>

//                         <IconButton color="inherit" onClick={handleClickMore}>
//                             <MoreVertIcon />
//                         </IconButton>
//                         <Menu
//                             anchorEl={anchorElMore}
//                             open={openMore}
//                             onClose={handleCloseMore}
//                             PaperProps={{
//                                 elevation: 4,
//                                 sx: {
//                                     borderRadius: 2,
//                                     mt: 1,
//                                     minWidth: 180,
//                                     bgcolor: "white",
//                                 },
//                             }}
//                             transformOrigin={{ horizontal: "right", vertical: "top" }}
//                             anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//                         >
//                             <MenuItem
//                                 onClick={() => {
//                                     handleCloseMore();
//                                     handleOpenLogoutDialog();
//                                     console.log("Edit Profile clicked");
//                                 }}
//                                 sx={{
//                                     "&:hover": {
//                                         backgroundColor: "#ff9f00",
//                                     },
//                                 }}
//                             >
//                                 <ListItemIcon>
//                                     <EditIcon fontSize="small" />
//                                 </ListItemIcon>
//                                 <ListItemText primary="Edit Profile" />
//                             </MenuItem>
//                             <MenuItem
//                                 onClick={() => {
//                                     handleCloseMore();
//                                     console.log("History clicked");
//                                     router.push("/history");
//                                 }
//                                 }
//                                 sx={{
//                                     "&:hover": {
//                                         backgroundColor: "#ff9f00",
//                                     },
//                                 }}
//                             >
//                                 <ListItemIcon>
//                                     <HistoryIcon fontSize="small" />
//                                 </ListItemIcon>
//                                 <ListItemText primary="History" />
//                             </MenuItem>
//                             <Divider />
//                             <MenuItem
//                                 onClick={() => {
//                                     handleCloseMore();
//                                     handleOpenLogoutDialog();
//                                     console.log("Sign Out clicked");
//                                 }}
//                                 sx={{
//                                     "&:hover": {
//                                         backgroundColor: "#ff9f00",
//                                     },
//                                 }}
//                             >
//                                 <ListItemIcon>
//                                     <LogoutIcon fontSize="small" />
//                                 </ListItemIcon>
//                                 <ListItemText primary="Sign Out" />
//                             </MenuItem>
//                         </Menu>

//                         <Dialog
//                             open={openLogoutDialog}
//                             onClose={handleCloseLogoutDialog}
//                             aria-labelledby="logout-dialog-title"
//                             aria-describedby="logout-dialog-description"
//                         >
//                             <DialogTitle id="logout-dialog-title" sx={{ textAlign: "center" }}>
//                                 <WarningAmberIcon sx={{ color: "#ff7f00", fontSize: 50 }} />
//                             </DialogTitle>

//                             <DialogContent sx={{ textAlign: "center" }}>
//                                 <Typography variant="h6" gutterBottom>
//                                     Are you sure?
//                                 </Typography>
//                                 <Typography variant="body2">
//                                     You want to log out?
//                                 </Typography>
//                             </DialogContent>

//                             <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//                                 <Button
//                                     variant="contained"
//                                     color="error"
//                                     onClick={handleCloseLogoutDialog}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleConfirmLogout}
//                                     autoFocus
//                                 >
//                                     Log Out
//                                 </Button>
//                             </DialogActions>
//                         </Dialog>
//                     </Box>
//                 </Toolbar>
//             </AppBar>

//             {/* About Content */}
//             <Container maxWidth="lg" sx={{ py: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
//                     {/* Side Navigation */}
//                     <Box sx={{ width: { md: '200px' }, mb: { xs: 4, md: 0 } }}>
//                         <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={3}>
//                             About CookCraft
//                         </Typography>
//                         <Stack spacing={1}>
//                             <Link href="#about" passHref>
//                                 <Button
//                                     sx={{
//                                         justifyContent: 'flex-start',
//                                         color: '#ff6f00',
//                                         fontWeight: 'bold',
//                                         '&:hover': {
//                                             backgroundColor: '#fff3e0'
//                                         }
//                                     }}
//                                 >
//                                     Our Story
//                                 </Button>
//                             </Link>
//                             <Link href="#team" passHref>
//                                 <Button
//                                     sx={{
//                                         justifyContent: 'flex-start',
//                                         color: 'text.secondary',
//                                         '&:hover': {
//                                             backgroundColor: '#fff3e0'
//                                         }
//                                     }}
//                                 >
//                                     The Team
//                                 </Button>
//                             </Link>
//                             <Link href="#stats" passHref>
//                                 <Button
//                                     sx={{
//                                         justifyContent: 'flex-start',
//                                         color: 'text.secondary',
//                                         '&:hover': {
//                                             backgroundColor: '#fff3e0'
//                                         }
//                                     }}
//                                 >
//                                     By The Numbers
//                                 </Button>
//                             </Link>
//                         </Stack>
//                     </Box>

//                     {/* Main Content */}
//                     <Box sx={{ flex: 1 }}>
//                         {/* Hero Section */}
//                         <Box
//                             id="about"
//                             sx={{
//                                 mb: 8,
//                                 backgroundColor: 'white',
//                                 borderRadius: 4,
//                                 p: 5,
//                                 boxShadow: '0 8px 24px rgba(255, 111, 0, 0.1)'
//                             }}
//                         >
//                             <Typography
//                                 variant="h3"
//                                 color="#ff6f00"
//                                 fontWeight="bold"
//                                 gutterBottom
//                                 sx={{ mb: 3 }}
//                             >
//                                 Our Culinary Journey
//                             </Typography>

//                             <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
//                                 CookCraft was born from a simple idea: <strong>making cooking accessible to everyone</strong>, regardless of skill level or pantry contents. What started as a student project has grown into a vibrant community of food enthusiasts sharing their passion for cooking.
//                             </Typography>

//                             {/* Mission Statement */}
//                             <Box
//                                 sx={{
//                                     backgroundColor: '#fff3e0',
//                                     p: 3,
//                                     borderRadius: 2,
//                                     mb: 4,
//                                     borderLeft: '4px solid #ff6f00'
//                                 }}
//                             >
//                                 <Typography variant="h6" fontWeight="bold" gutterBottom>
//                                     Our Mission
//                                 </Typography>
//                                 <Typography>
//                                     To empower home cooks with smart tools that reduce food waste, save time, and make meal planning effortless while fostering a community of recipe sharing and culinary creativity.
//                                 </Typography>
//                             </Box>

//                             {/* Image and Quote */}
//                             <Box
//                                 sx={{
//                                     display: 'flex',
//                                     flexDirection: { xs: 'column', md: 'row' },
//                                     gap: 4,
//                                     alignItems: 'center',
//                                     mt: 5
//                                 }}
//                             >
//                                 <Box sx={{ flex: 1 }}>
//                                     <Typography
//                                         variant="h5"
//                                         fontWeight="bold"
//                                         gutterBottom
//                                         sx={{ fontStyle: 'italic', color: '#555' }}
//                                     >
//                                         "Every dish we create is a learning journey capturing the spirit, taste, and teamwork of student chefs."
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         — CookCraft Team
//                                     </Typography>
//                                 </Box>
//                                 <Box
//                                     component="img"
//                                     src="/images/food1.jpg"
//                                     alt="CookCraft Team"
//                                     sx={{
//                                         width: '100%',
//                                         maxWidth: '400px',
//                                         borderRadius: 2,
//                                         boxShadow: 3,
//                                         transition: 'transform 0.3s',
//                                         '&:hover': {
//                                             transform: 'scale(1.02)'
//                                         }
//                                     }}
//                                 />
//                             </Box>
//                         </Box>

//                         {/* Team Section */}
//                         <Box
//                             id="team"
//                             sx={{
//                                 mb: 8,
//                                 backgroundColor: 'white',
//                                 borderRadius: 4,
//                                 p: 5,
//                                 boxShadow: '0 8px 24px rgba(255, 111, 0, 0.1)'
//                             }}
//                         >
//                             <Typography
//                                 variant="h3"
//                                 color="#ff6f00"
//                                 fontWeight="bold"
//                                 gutterBottom
//                                 sx={{ mb: 4 }}
//                             >
//                                 Meet The Team
//                             </Typography>

//                             <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
//                                 Behind every delicious recipe is a dedicated team of passionate students — cooks, developers, and designers — all working together to bring food to life online. From testing recipes in the kitchen to styling dishes and writing clear, easy-to-follow instructions, we create and collaborate with care.
//                             </Typography>

//                             {/* Team Members Flex Container */}
//                             <Box sx={{
//                                 display: 'flex',
//                                 flexWrap: 'wrap',
//                                 gap: 4,
//                                 justifyContent: { xs: 'center', sm: 'space-between' }
//                             }}>
//                                 {[1, 2, 3, 4, 5].map((member) => (
//                                     <Box
//                                         key={member}
//                                         sx={{
//                                             width: { xs: '100%', sm: '48%', md: '30%' },
//                                             minWidth: '280px',
//                                             flexGrow: 1
//                                         }}
//                                     >
//                                         <Card
//                                             sx={{
//                                                 height: '100%',
//                                                 display: 'flex',
//                                                 flexDirection: 'column',
//                                                 transition: 'transform 0.3s, box-shadow 0.3s',
//                                                 '&:hover': {
//                                                     transform: 'translateY(-5px)',
//                                                     boxShadow: '0 10px 20px rgba(255, 111, 0, 0.2)'
//                                                 }
//                                             }}
//                                         >
//                                             <CardMedia
//                                                 component="img"
//                                                 height="200"
//                                                 image={`/images/team${member}.jpg`}
//                                                 alt={`Team Member ${member}`}
//                                             />
//                                             <CardContent sx={{ flexGrow: 1 }}>
//                                                 <Typography gutterBottom variant="h5" component="div">
//                                                     Team Member {member}
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary">
//                                                     {member === 1 && 'Head Chef & Recipe Developer'}
//                                                     {member === 2 && 'Frontend Developer'}
//                                                     {member === 3 && 'UI/UX Designer'}
//                                                     {member === 4 && 'Backend Developer'}
//                                                     {member === 5 && 'Content Writer'}
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Box>
//                                 ))}
//                             </Box>
//                         </Box>

//                         {/* Stats Section */}
//                         <Box
//                             id="stats"
//                             sx={{
//                                 backgroundColor: 'white',
//                                 borderRadius: 4,
//                                 p: 5,
//                                 boxShadow: '0 8px 24px rgba(255, 111, 0, 0.1)'
//                             }}
//                         >
//                             <Typography
//                                 variant="h3"
//                                 color="#ff6f00"
//                                 fontWeight="bold"
//                                 gutterBottom
//                                 sx={{ mb: 4 }}
//                             >
//                                 By The Numbers
//                             </Typography>

//                             {/* Stats Flex Container */}
//                             <Box sx={{
//                                 display: 'flex',
//                                 flexWrap: 'wrap',
//                                 gap: 3,
//                                 justifyContent: 'space-between'
//                             }}>
//                                 {/* Stat Item 1 */}
//                                 <Paper
//                                     sx={{
//                                         p: 3,
//                                         textAlign: 'center',
//                                         flex: '1 1 250px',
//                                         minWidth: '250px',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         transition: 'transform 0.3s',
//                                         '&:hover': {
//                                             transform: 'scale(1.05)',
//                                             backgroundColor: '#fff3e0'
//                                         }
//                                     }}
//                                 >
//                                     <EmojiEventsIcon
//                                         fontSize="large"
//                                         color="warning"
//                                         sx={{ fontSize: '3rem', mb: 2 }}
//                                     />
//                                     <Typography variant="h4" fontWeight="bold" color="#ff6f00">
//                                         100+
//                                     </Typography>
//                                     <Typography variant="subtitle1">
//                                         Tested Recipes
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Created and perfected by our team
//                                     </Typography>
//                                 </Paper>

//                                 {/* Stat Item 2 */}
//                                 <Paper
//                                     sx={{
//                                         p: 3,
//                                         textAlign: 'center',
//                                         flex: '1 1 250px',
//                                         minWidth: '250px',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         transition: 'transform 0.3s',
//                                         '&:hover': {
//                                             transform: 'scale(1.05)',
//                                             backgroundColor: '#fff3e0'
//                                         }
//                                     }}
//                                 >
//                                     <MenuBookIcon
//                                         fontSize="large"
//                                         color="success"
//                                         sx={{ fontSize: '3rem', mb: 2 }}
//                                     />
//                                     <Typography variant="h4" fontWeight="bold" color="#ff6f00">
//                                         50+
//                                     </Typography>
//                                     <Typography variant="subtitle1">
//                                         Community Recipes
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Shared by our growing foodie community
//                                     </Typography>
//                                 </Paper>

//                                 {/* Stat Item 3 */}
//                                 <Paper
//                                     sx={{
//                                         p: 3,
//                                         textAlign: 'center',
//                                         flex: '1 1 250px',
//                                         minWidth: '250px',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         transition: 'transform 0.3s',
//                                         '&:hover': {
//                                             transform: 'scale(1.05)',
//                                             backgroundColor: '#fff3e0'
//                                         }
//                                     }}
//                                 >
//                                     <GroupIcon
//                                         fontSize="large"
//                                         color="info"
//                                         sx={{ fontSize: '3rem', mb: 2 }}
//                                     />
//                                     <Typography variant="h4" fontWeight="bold" color="#ff6f00">
//                                         5+
//                                     </Typography>
//                                     <Typography variant="subtitle1">
//                                         Student Chefs
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Creating and sharing delicious recipes
//                                     </Typography>
//                                 </Paper>

//                                 {/* Stat Item 4 */}
//                                 <Paper
//                                     sx={{
//                                         p: 3,
//                                         textAlign: 'center',
//                                         flex: '1 1 250px',
//                                         minWidth: '250px',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         transition: 'transform 0.3s',
//                                         '&:hover': {
//                                             transform: 'scale(1.05)',
//                                             backgroundColor: '#fff3e0'
//                                         }
//                                     }}
//                                 >
//                                     <SchoolIcon
//                                         fontSize="large"
//                                         color="secondary"
//                                         sx={{ fontSize: '3rem', mb: 2 }}
//                                     />
//                                     <Typography variant="h4" fontWeight="bold" color="#ff6f00">
//                                         2+
//                                     </Typography>
//                                     <Typography variant="subtitle1">
//                                         Expert Mentors
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Guiding our culinary development
//                                     </Typography>
//                                 </Paper>
//                             </Box>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Container>
//         </Box>
//     );
// }
