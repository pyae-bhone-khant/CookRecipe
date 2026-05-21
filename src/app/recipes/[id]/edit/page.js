// "use client";
// import { Box } from "@mui/material";

// export default function EditPage(){
//     return <Box>Recipe Edit Page</Box>
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent, Typography } from '@mui/material';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// export default function HistoryPage() {
//   const [histories, setHistories] = useState([]);

//   useEffect(() => {
//     const fetchHistories = async () => {
//       const res = await fetch('/api/users/histories');
//       const data = await res.json();
//       setHistories(data);
//     };
//     fetchHistories();
//   }, []);

//   const formatTime = (date) =>
//     new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const getIcon = (action) => {
//     switch (action) {
//       case 'created': return '🧾';
//       case 'liked': return '❤️';
//       case 'commented': return '💬';
//       default: return '🔔';
//     }
//   };

//   return (
//     <div style={{ padding: '1rem' }}>
//       <Typography variant="h6" gutterBottom>
//         Your History
//       </Typography>
//       {histories.length === 0 ? (
//         <Typography>No history found.</Typography>
//       ) : (
//         histories.map((history) => (
//           <Card key={history.id} sx={{ mb: 2, backgroundColor: '#fff7ed' }}>
//             <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
//               <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
//               <Typography variant="body2">
//                 {formatTime(history.createdAt)} {getIcon(history.action)} {history.message}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// }
