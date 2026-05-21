// components/CoverImageUpload.jsx
import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Typography
} from '@mui/material';
import { CameraAlt, Edit } from '@mui/icons-material';

const CoverImageUpload = ({ user, onUpload }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!fileInputRef.current.files[0]) return;

    try {
      const file = fileInputRef.current.files[0];
      const base64Image = await fileToBase64(file);

      const response = await fetch('/api/upload/cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'cover'
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUpload('cover', data.image_url);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <CardMedia
        component="img"
        height="200"
        image={previewImage || user.coverImage || '/default-cover.jpg'}
        alt="Cover"
      />
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton
          onClick={() => fileInputRef.current.click()}
          sx={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
        >
          <Edit />
        </IconButton>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </Box>
      {previewImage && (
        <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraAlt />}
            onClick={handleUpload}
          >
            Save Cover Image
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CoverImageUpload;
