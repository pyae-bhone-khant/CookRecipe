import React from "react";
import { Box, Typography, Container } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ff6f00",
        color: "white",
        py: 3,
        px: 2,
        borderTop: "1px solid #ffe0b2",
        mt: 4,
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          COOKCRAFT
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Where culinary creativity meets community
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          © {new Date().getFullYear()} Made with
          <FavoriteIcon sx={{ color: "white", fontSize: "14px" }} />
          in Myanmar
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;