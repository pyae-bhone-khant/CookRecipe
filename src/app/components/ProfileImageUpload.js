// components/ProfileImageUpload.jsx
import { useState, useRef } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography
} from '@mui/material';
import { CameraAlt, Edit } from '@mui/icons-material';

const ProfileImageUpload = ({ user, onUpload }) => {
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

  const handleUpload = async (imageType) => {
    if (!fileInputRef.current.files[0]) return;

    try {
      const file = fileInputRef.current.files[0];
      const base64Image = await fileToBase64(file);

      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'profile'
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUpload(imageType, data.image_url);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar
            src={previewImage || user.profileImage || '/default-avatar.png'}
            sx={{ width: 100, height: 100 }}
          />
        }
        action={
          <IconButton onClick={() => fileInputRef.current.click()}>
            <Edit />
          </IconButton>
        }
      />
      <CardContent>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {previewImage && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraAlt />}
            onClick={() => handleUpload('profile')}
            fullWidth
          >
            Save Profile Image
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpload;
