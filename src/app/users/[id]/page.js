// "use client";
// import { Box } from "@mui/material";

// export default function UserDetail(){
//     return <Box>User Detail Page</Box>
// }

// app/users/[id]/page.jsx
// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import {
//   Typography,
//   Box,
//   Paper,
//   CircularProgress,
//   Divider,
// } from "@mui/material";

// export default function UserDetailPage() {
//   const { id } = useParams(); // Get user ID from the URL
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const getUserDetail = async () => {
//     try {
//       const res = await axios.get(`/api/users/${id}`);
//       setUser(res.data);
//     } catch (err) {
//       console.error("Error fetching user detail:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUserDetail();
//   }, [id]);

//   if (loading) return <CircularProgress />;

//   if (!user) return <Typography>User not found.</Typography>;

//   return (
//     <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         User Detail
//       </Typography>
//       <Divider sx={{ mb: 2 }} />
//       <Typography>
//         <strong>Username:</strong> {user.username}
//       </Typography>
//       <Typography>
//         <strong>Email:</strong> {user.email}
//       </Typography>
//       <Typography>
//         <strong>Role:</strong> {user.role}
//       </Typography>
//       <Typography>
//         <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
//       </Typography>
//     </Paper>
//   );
// }
