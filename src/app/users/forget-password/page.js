"use client";

import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import EmailIcon from "@mui/icons-material/Email";

const schema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
});

export default function ForgetPassword() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setSnackbar({
          open: true,
          message: "Password reset instructions have been sent to your email.",
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "An error occurred. Please try again.",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setSnackbar({
        open: true,
        message: "Network error. Please check your connection and try again.",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
          <EmailIcon sx={{ fontSize: 60, color: "#ff6f00", mb: 2 }} />
          <Typography variant="h5" mb={2} color="#ff6f00">
            Check Your Email
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            We've sent password reset instructions to your email address.
            Please check your inbox and follow the link to reset your password.
          </Typography>
          <Typography variant="body2" mb={3} color="text.secondary">
            Didn't receive the email? Check your spam folder or try again.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setEmailSent(false)}
            sx={{
              mr: 2,
              borderColor: "#ff6f00",
              color: "#ff6f00",
              "&:hover": {
                borderColor: "#e65100",
                backgroundColor: "rgba(255, 111, 0, 0.04)",
              },
            }}
          >
            Try Again
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/users/sign-in")}
            sx={{
              backgroundColor: "#ff6f00",
              "&:hover": { backgroundColor: "#e65100" },
            }}
          >
            Back to Sign In
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
            Forgot Password?
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <TextField
            label="Email Address"
            variant="outlined"
            margin="normal"
            fullWidth
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
            InputProps={{ sx: { borderRadius: 3 } }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
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
              "Send Reset Link"
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
