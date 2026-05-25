

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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { getSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  identifier: yup.string().required("Username or Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      setLoginError("");

      const response = await signIn("credentials", {
        ...formData,
        redirect: false,
      });

      if (response.ok) {
        toast.success("Login successful! Welcome back.");
        router.push("/home");
      } else {
        const errorMessage = response.error || "Invalid credentials. Please try again.";
        setLoginError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    }
  };


  return (
    <Box
      // padding={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        // minHeight: "100vh",
        // background: "#f5f5f5",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
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
          // width: "100%",
          // maxWidth: 400,
          // p: 4,
          // borderRadius: 3,
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
            Welcome back to CoolCraft!
          </Typography>
          <Typography variant="body2" color="#10B981">
            Sign in to continue sharing
          </Typography>

          <TextField
            label="Username or Email"
            variant="outlined"
            margin="normal"

            fullWidth
            {...register("identifier")}
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
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
          <Button href="/users/forget-password" variant="body2" sx={{
                  '&:hover': {
                    color:'#10B981',
                  }
             }}>
            Forget Password
          </Button>

          {loginError && (
            <Typography variant="body2" color="error" mt={1}>
              {loginError}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, backgroundColor: "#10B981", color: "#fff", borderRadius: 4,
              transition: 'transform 0.5s',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    backgroundColor: '#059669',
                    transform: 'translateY(-5px)',
                  }
             }}
          >
            Login
          </Button>

          <Typography variant="body2" mt={2} textAlign="center">
            Don't have an account?{" "}
            <Button href="/users/sign-up" size="small" 
              sx={{
                  '&:hover': {
                    color:'#10B981',
                  }
             }}
            >
              Sign Up
            </Button>
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
