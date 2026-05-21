"use client";

import React from "react";
import {
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Close";

export default function ImageUploadCircle({
  image,
  setImage,
  error = "",
  size = 80,
  label = "Upload",
  showRemove = true,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); 
    };
    reader.onerror = () => {
      alert("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImage("");
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box position="relative" sx={{ width: size, height: size }}>
        <Avatar
          src={image}
          alt="Profile"
          sx={{ width: size, height: size }}
        />

        <input
          type="file"
          accept="image/*"
          id="upload-photo"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label htmlFor="upload-photo">
          <Tooltip title={label}>
            <IconButton
              component="span"
              size="small"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -5,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                zIndex: 2,
                padding: 0.5,
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Tooltip>
        </label>

        {image && showRemove && (
          <Tooltip title="Remove">
            <IconButton
              size="small"
              onClick={handleRemove}
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                zIndex: 3,
                padding: 0.5,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
}