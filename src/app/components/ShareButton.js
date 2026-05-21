"use client";

import React from "react";
import { Button } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

const ShareButton = ({ title, text, url }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Check this recipe!",
          text: text || "I found a delicious recipe you might like!",
          url: url || window.location.href,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<ShareIcon />}
      size="small"
      onClick={handleShare}
    >
      Share
    </Button>
  );
};

export default ShareButton;
