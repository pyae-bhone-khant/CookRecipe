"use client";

import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import LockResetIcon from "@mui/icons-material/LockReset";

const schema = yup.object().shape({
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

function ResetPasswordForm() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Invalid reset link. Please request a new password reset.",
        severity: "error"
      });
      setTimeout(() => {
        router.push("/users/forget-password");
      }, 3000);
    }
  }, [token, router]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (formData) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(true);
        setSnackbar({
          open: true,
          message: "Password reset successfully! Redirecting to sign in...",
          severity: "success"
        });
        setTimeout(() => {
          router.push("/users/sign-in");
        }, 3000);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to reset password. Please try again.",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setSnackbar({
        open: true,
        message: "Network error. Please check your connection and try again.",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <Box
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
            maxWidth: 500,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <LockResetIcon sx={{ fontSize: 60, color: "#4caf50", mb: 2 }} />
          <Typography variant="h5" mb={2} color="#4caf50">
            Password Reset Successful!
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            Your password has been successfully reset. You can now sign in with your new password.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/users/sign-in")}
            sx={{
              backgroundColor: "#ff6f00",
              "&:hover": { backgroundColor: "#e65100" },
            }}
          >
            Go to Sign In
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" mb={1} color="#ff6f00" fontWeight="bold">
            Reset Password
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            Enter your new password below. Make sure it's strong and secure.
          </Typography>

          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
            InputProps={{
              sx: { borderRadius: 3 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            fullWidth
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={isLoading}
            InputProps={{
              sx: { borderRadius: 3 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading || !token}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#ff6f00",
              color: "#fff",
              borderRadius: 4,
              py: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#e65100",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reset Password"
            )}
          </Button>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Remember your password?{" "}
            <Button
              href="/users/sign-in"
              size="small"
              sx={{
                textTransform: "none",
                color: "#ff6f00",
                "&:hover": { color: "#e65100" },
              }}
            >
              Sign In
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#ff6f00" }} />
      </Box>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
