


"use client";
import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Avatar, IconButton, Paper, MenuItem,
  CircularProgress, Alert, Snackbar
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    day: '',
    month: '',
    year: '',
    gender: '',
  });

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Generate days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  // Generate months (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // Generate years (1900-current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  const userId = session?.user?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Upload profile image with base64
  const uploadProfileImage = async (file) => {
    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);

      const res = await fetch("/api/upload/profile", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'profile'
        }),
      });

      if (!res.ok) throw new Error("Failed to upload profile image");

      const data = await res.json();
      return data.image_url; // Return the base64 image URL
    } catch (err) {
      console.error("Upload profile image failed:", err);
      throw err;
    }
  };

  // Upload cover image with base64
  const uploadCoverImage = async (file) => {
    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);

      const res = await fetch("/api/upload/cover", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          imageType: file.type,
          uploadType: 'cover'
        }),
      });

      if (!res.ok) throw new Error("Failed to upload cover image");

      const data = await res.json();
      return data.image_url; // Return the base64 image URL
    } catch (err) {
      console.error("Upload cover image failed:", err);
      throw err;
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewProfile(URL.createObjectURL(file));
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    fetchUserData();
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();

      // Parse birthdate if it exists
      let day = '';
      let month = '';
      let year = '';

      if (userData.birthdate) {
        const date = new Date(userData.birthdate);
        day = date.getDate().toString();
        month = (date.getMonth() + 1).toString(); // Month is 0-indexed
        year = date.getFullYear().toString();
      }

      setProfile({
        username: userData.username || userData.name || '',
        phoneNumber: userData.phone || '',
        email: userData.email || '',
        day,
        month,
        year,
        gender: userData.gender || '',
      });

      // Set profile and cover images if they exist
      if (userData.image_url) {
        setPreviewProfile(userData.image_url);
      }

      if (userData.coverImage) {
        setPreviewCover(userData.coverImage);
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.id) {
      setError('You must be logged in to update your profile');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Prepare birthdate if all date fields are filled
      let birthdate = null;
      if (profile.day && profile.month && profile.year) {
        birthdate = new Date(
          parseInt(profile.year),
          parseInt(profile.month) - 1, // Month is 0-indexed
          parseInt(profile.day)
        ).toISOString();
      }

      // Prepare update data
      const updateData = {
        username: profile.username,
        phone: profile.phoneNumber,
        email: profile.email,
        gender: profile.gender,
      };

      if (birthdate) {
        updateData.birthdate = birthdate;
      }

      // Handle image uploads
      if (profilePhoto) {
        try {
          const profileImageUrl = await uploadProfileImage(profilePhoto);
          updateData.image_url = profileImageUrl;
        } catch (err) {
          throw new Error('Failed to upload profile image');
        }
      }

      if (coverPhoto) {
        try {
          const coverImageUrl = await uploadCoverImage(coverPhoto);
          updateData.coverImage = coverImageUrl;
        } catch (err) {
          throw new Error('Failed to upload cover image');
        }
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      setSuccess(true);

      // Navigate back to profile after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 1500);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = () => {
    router.push('/profile');
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccess(false);
  };

  if (status === 'loading' || loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <CircularProgress sx={{ color: '#ff6f00' }} />
        <Typography sx={{ ml: 2 }}>Loading your profile...</Typography>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Typography>Please log in to edit your profile.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/images/edit-background.jpg)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', // This makes the background fixed during scroll
        zIndex: -1,
      }
    }}>
      {/* Success message */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        mx: 'auto',
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px', md: '800px' },
        py: 4,
        px: 2,
        gap: 3,
        boxShadow: '0 4px 12px ',
        backdropFilter: 'blur(5px)', // Optional: adds blur effect to background
        minHeight: '100vh',
        borderRadius: 5,
        mt: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBackClick} sx={{ color: 'primary.main' }}>
            <ArrowBackIcon fontSize="large" />
          </IconButton>
          <Typography variant="h4" fontWeight={700}>
            Edit Profile
          </Typography>
        </Box>

        {/* Cover Photo */}
        <Box sx={{
          position: 'relative', height: '200px', bgcolor: '#f0f0f0', borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          {previewCover ? (
            <img src={previewCover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Typography color="text.secondary">Add a cover photo</Typography>
          )}
          <input
            accept="image/*" id="cover-photo-upload" type="file" hidden
            onChange={handleCoverPhotoChange}
          />
          <label htmlFor="cover-photo-upload">
            <IconButton component="span" sx={{
              position: 'absolute', bottom: 10, right: 10,
              bgcolor: 'white', transition: 'all 0.3s ease',
              '&:hover': { bgcolor: 'primary.light' }
            }}>
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
        </Box>

        {/* Profile Photo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: -6, zIndex: 1 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src={previewProfile || '/default-profile.png'}
              sx={{ width: 100, height: 100, border: '3px solid white', bgcolor: '#f0f0f0' }}
            />
            <input
              accept="image/*" id="profile-photo-upload" type="file" hidden
              onChange={handleProfilePhotoChange}
            />
            <label htmlFor="profile-photo-upload">
              <IconButton component="span" sx={{
                position: 'absolute', bottom: 0, right: 0,
                bgcolor: 'white', transition: 'all 0.3s ease',
                '&:hover': { bgcolor: 'primary.light' }
              }}>
                <AddPhotoAlternateIcon fontSize="small" />
              </IconButton>
            </label>
          </Box>
          <Typography variant="h5" fontWeight={600}>
            {profile.username}
          </Typography>
        </Box>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(255, 111, 0, 0.3)",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Day"
                name="day"
                value={profile.day}
                onChange={handleChange}
                fullWidth
                sx={{ flex: 1 }}
              >
                <MenuItem value=""><em>Select day</em></MenuItem>
                {days.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Month"
                name="month"
                value={profile.month}
                onChange={handleChange}
                fullWidth
                sx={{ flex: 1 }}
              >
                <MenuItem value=""><em>Select month</em></MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>{month}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Year"
                name="year"
                value={profile.year}
                onChange={handleChange}
                fullWidth
                sx={{ flex: 1 }}
              >
                <MenuItem value=""><em>Select year</em></MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              select label="Gender" name="gender" value={profile.gender}
              onChange={handleChange} fullWidth
            >
              <MenuItem value=""><em>Select gender</em></MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              sx={{
                alignSelf: 'flex-end',
                px: 2,
                py: 1,
                color: 'white',
                background: '#ff6f00',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(255, 111, 0, 0.9)',
                  backgroundColor: '#e65100'
                }
              }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
