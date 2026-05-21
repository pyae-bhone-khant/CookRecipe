// "use client";

// import React from "react";
// import {
//   AppBar,
//   Box,
//   Toolbar,
//   Typography,
//   IconButton,
//   Avatar,
//   Container,
//   Paper,
//   Stack,
//   Button,
//   List,
//   ListItem,
//   Checkbox,
//   TextField,
//   Chip,
//   Rating,
//   Card,
//   CardMedia,
//   CardContent,
//    ListItemText, Divider,
  
// } from "@mui/material";

// import ShareIcon from "@mui/icons-material/Share";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import { useRouter } from "next/navigation";
// import Link from 'next/link'; // Next.js ရဲ့ Link component

// import { useState } from "react";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';


// export default function RecipeDetailPage() {

//   const router = useRouter();

//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [anchorE2, setAnchorE2] = React.useState(null);
//   const openProfile = Boolean(anchorEl);
//   const openNotification = Boolean(anchorE2);
//   const handleClickProfile = (event) => setAnchorEl(event.currentTarget);
//   const handleClickNotification = (event) => setAnchorE2(event.currentTarget);
//   const handleCloseProfile = () => setAnchorEl(null);
//   const handleCloseNotification = () => setAnchorE2(null);
//   const [currentPage, setCurrentPage] = useState(2);
//    const [liked, setLiked] = useState(false);

  

//   // arrow 
//   const handleBackClick = () => {
//     router.push('/home');
//   };

//     const handleLikeClick = () => {
//     setLiked(!liked);
//   };

//   return (
//     <Box>
//       {/* Navbar */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, m: 5 }}>
//         <IconButton onClick={handleBackClick} sx={{ color: 'primary.main' }}>
//           <ArrowBackIcon fontSize="large" />
//         </IconButton>
//         <Typography variant="h4" fontWeight={700}>
//           Detail...
//         </Typography>
//       </Box>

//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
//           {/* Left Side */}
//           <Box flex={2}>
//             <Card elevation={6} sx={{ borderRadius: 3 }}>
//               <CardMedia
//                 component="img"
//                 width="400"
//                 height="500"
//                 image="/images/chicken.jpg"
//                 alt="Crispy Fried Prawns"
//               />
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold">
//                   Crispy Fried Prawns
//                 </Typography>
//                 <Stack direction="row" alignItems="center" spacing={1} my={1}>
//                   <Avatar sx={{ width: 24, height: 24 }} />
//                   <Typography variant="body2">Kelvin</Typography>
//                 </Stack>
//                 <Stack direction="row" spacing={1} my={1}>
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Checkbox 
//                       icon={<ThumbUpIcon />}
//                       checkedIcon={<ThumbUpIcon color="primary" />}
//                       checked={liked}
//                       onChange={handleLikeClick}
//                     />
//                     <Typography variant="body2">LIKE</Typography>
//                   </Box>
//                   <Button
//                     variant="outlined"
//                     startIcon={<ShareIcon />}
//                     size="small"
//                   >
//                     Share
//                   </Button>
//                 </Stack>
//                 <Rating value={4} readOnly size="small" />
//                 <Stack direction="row" spacing={2} mt={2}>
//                   <Chip label="Prep Time - 10 mins" variant="outlined" />
//                   <Chip label="Cook Time - 20 mins" variant="outlined" />
//                 </Stack>
//               </CardContent>
//             </Card>

//             {/* Comments */}


//             <Paper variant="outlined" sx={{ mt: 4, p: 2 }}>
//               <Typography variant="h6">Comments</Typography>

//               {/* Scrollable comment list */}
//               <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
//                 {[
//                   { name: "Kelvin", time: "1 hour ago" },
//                   { name: "Alice", time: "2 hours ago" },
//                   { name: "Sweet", time: "2 hours ago" },
//                   { name: "Rose", time: "2 hours ago" },
//                   // Add more dummy comments here if needed
//                 ].map((comment, index) => (
//                   <Box key={index} mt={2}>
//                     <Stack direction="row" spacing={2} alignItems="center">
//                       <Avatar sx={{ width: 32, height: 32 }}>
//                         {comment.name[0]}
//                       </Avatar>
//                       <Box>
//                         <Typography fontWeight="bold">
//                           {comment.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {comment.time}
//                         </Typography>
//                         <Typography mt={0.5}>Comment Text</Typography>
//                         <Stack direction="row" spacing={1} mt={1}>
//                           <Button size="small">1 reply</Button>
//                           <Button size="small">Reply</Button>
//                         </Stack>
//                       </Box>
//                     </Stack>
//                     <Divider sx={{ mt: 2 }} />
//                   </Box>
//                 ))}
//               </Box>

//               {/* Add comment input */}
//               <Stack direction="row" spacing={2} alignItems="center" mt={2}>
//                 <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
//                 <TextField
//                   variant="outlined"
//                   size="small"
//                   placeholder="Add a comment"
//                   fullWidth
//                 />
//                 <Button variant="contained" sx={{ bgcolor: "#F57C00", color: '#fff' }}>
//                   Send
//                 </Button>
//               </Stack>
//             </Paper>
//           </Box>

//           {/* Right Side */}
//           <Box flex={1}>
//             <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Ingredients
//               </Typography>
//               {/* Scrollable */}
//               <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
//                 <List>
//                 {[
//                   "Prawns",
//                   "Wheat flour",
//                   "Corn flour",
//                   "Rice flour",
//                   "Egg",
//                   "Salt",
//                   "Prawns",
//                   "Wheat flour",
//                   "Corn flour",
//                   "Rice flour",
//                   "Egg",
//                   "Salt",
//                   "Prawns",
//                   "Wheat flour",
//                   "Corn flour",
//                   "Rice flour",
//                   "Egg",
//                   "Salt",
//                 ].map((item, index) => (
//                   <ListItem key={index} disablePadding>
//                     <ListItemText primary={`• ${item}`} />
//                   </ListItem>
//                 ))}
//               </List>
//               </Box>
              
//             </Paper>
//             <Paper variant="outlined" sx={{ p: 2 }}>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Instruction
//               </Typography>
//               <Box sx={{ maxHeight: 525, overflowY: "auto", pr: 1 }}>

//                 <Typography variant="body2" whiteSpace="pre-line">
//                 {`Heat oil in a heavy-bottomed pot, over low heat. Sprinkle the sugar and stir continuously until it is caramelized.

// Add and sear the pork on all sides. Stir-in the chopped onions and garlic.

// Season with soy sauce and add enough water to fully submerge the pork belly.

// Turn the heat up to high and bring the liquid to a boil, then reduce it to medium-low for slow simmer.

// Cover the pot and braise the pork for about 1 hour and 30 minutes. Stir 2-3 times in between and adjust the water as necessary to prevent the bottom from burning.

// When the pork belly is tender and almost all the braising liquid has evaporated, add the pearl onions and cook for about 5 minutes. The sauce needs to be reduced to a thick glaze consistency.

// When the pork belly is tender and almost all the braising liquid has evaporated, add the pearl onions and cook for about 5 minutes. The sauce needs to be reduced to a thick glaze consistency.

// Remove the pot from heat, sprinkle the chopped spring onions and serve with rice.`}
//               </Typography>

//               </Box>
              
//             </Paper>
//           </Box>
//         </Stack>

//         {/* Recommend Section */}
//         <Box mt={6}>
//           <Typography variant="h6" gutterBottom>
//             Recommend
//           </Typography>
//           <Stack direction="row" spacing={2}>
//             {[
//               "Egg Curry",
//               "Burmese Tea Leaves Salad",
//               "Peanut Sauce",
//               "Chicken Curry",
//               "Peanut Sauce",
//               "Chicken Curry",
//             ].map((label, index) => (
//               <Paper
//                 key={index}
//                 sx={{ width: 200, borderRadius: 2, overflow: "hidden" }}
//               >
//                 <Box
//                   component="img"
//                   src={`/images/food${index + 1}.jpg`}
//                   alt={label}
//                   sx={{ width: "100%", height: 100, objectFit: "cover" }}
//                 />
//                 <Box p={1}>
//                   <Typography variant="body2" fontWeight="bold">
//                     {label}
//                   </Typography>
//                 </Box>
//               </Paper>
//             ))}

//           </Stack>
//         </Box>
//       </Container>
//     </Box>
//   );
// }
