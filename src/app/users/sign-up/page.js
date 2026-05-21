"use client";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = yup.object().shape({
  username: yup.string().required("Name is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number'),
});

export default function SignUp() {

  // password icon view
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  })

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      await axios.post("/api/users", formData);
      reset();
      // Optionally, show a success message before redirecting
      router.push("/users/sign-in");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box padding={2} component="form" onSubmit={handleSubmit(onSubmit)}
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/002/025/448/large_2x/fresh-vegetable-and-herb-border-free-photo.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 800,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Left: Form Section */}
        <Box sx={{
          flex: 1,
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
        }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Join CookCraft Today!
          </Typography>
          <Typography variant="body2" color="#10B981">
            Create your account to start sharing
          </Typography>

          <TextField
            fullWidth
            label="Username"
            type="text"
            variant="outlined"
            margin="normal"

            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            InputProps={{
              sx: {
                borderRadius: 3, // or '8px'
              },
            }}

          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"

            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              sx: {
                borderRadius: 3, // or '8px'
              },
            }}

          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              sx: {
                borderRadius: 3, // or '8px'
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {apiError && (
            <Typography variant="body2" color="error" mt={1} textAlign="center">
              {apiError}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2, backgroundColor: "#10B981", color: "#fff", borderRadius: 4,
              transition: 'transform 0.5s',
              transition: 'all 0.5s ease',
              '&:hover': {
                backgroundColor: '#059669',
                transform: 'translateY(-5px)',
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>

          <Typography variant="body2" mt={2} textAlign="center">
            Already have an account?{" "}
            <MuiLink component={Link} href="/users/sign-in" underline="hover"
            sx={{
              transition: 'transform 0.5s',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    color:'#10B981',
                    transform: 'translateY(-5px)',
                  }
             }}
            >
              SIGN IN
            </MuiLink>
          </Typography>

        </Box>

        {/* Right: Image Section */}
        <Box
          sx={{
            flex: 1,
            minHeight: { xs: 200, md: "auto" },
            backgroundImage: `url(https://www.adobe.com/acrobat/hub/media_1b055f61b038d654ab3dc0cd5328a4f0e6346c9ab.jpeg?width=1200&format=pjpg&optimize=medium)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Paper>
    </Box>
  );
}
