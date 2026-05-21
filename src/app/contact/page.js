"use client";

import React from "react";
import {
  Typography,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Paper,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Navbar from "../components/Navbar";

export default function Contact() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState(null);

  // Effect to handle mailto after render
  React.useEffect(() => {
    if (formData) {
      const { name, phone, subject, email, message } = formData;

      const mailtoLink = `mailto:htethtethlanig064@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage: ${message}`
      )}`;

      window.location.href = mailtoLink;
    }
  }, [formData]);

  // html mailto
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      name: e.target.name.value,
      phone: e.target.phone.value,
      subject: e.target.subject.value,
      email: e.target.email.value,
      message: e.target.message.value
    });
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* contact form */}
      <Box sx={{ bgcolor: "white", pt: 6 }}>
        {/* Top Section */}
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: { md: 400 },
              mt: 4,
              gap: 4,
            }}
          >
            {/* Left: Text */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Contact <br /> Informations
              </Typography>
              <Typography variant="body1" mb={3}>
                Whether you have a question about a recipe, want to give
                feedback, or just want to say hello, the CookCraft team is here
                to help. Fill out the form below or reach us directly through
                the contact information provided. <br />
                We aim to respond to all inquiries within 24–48 hours.
              </Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: "#10B981", color: "white" }}
              >
                CONTACT US
              </Button>
            </Box>

            {/* Right: Image */}
            <Box
              component="img"
              src="/images/contact-girl.png"
              alt="Contact"
              sx={{
                width: { xs: "80%", sm: "70%", md: "90%" },
                maxWidth: "350px",
                borderRadius: 3,
                flex: 1,
              }}
            />
          </Box>
        </Container>

        {/* Middle Form Section */}
        <Box sx={{ bgcolor: "#e9e9e9", py: 6, mt: 6 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              mb={4}
              color="#10B981"
            >
              Send Message
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              {/* Contact Info - Left Side */}
              <Stack spacing={3} sx={{ flex: 1 }}>
                <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <PhoneIcon sx={{ mr: 2 }} color="action" />
                  <Box>
                    <Typography fontWeight="bold">Phone Number</Typography>
                    <Typography>+959123456789</Typography>
                  </Box>
                </Paper>
                <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <EmailIcon sx={{ mr: 2 }} color="action" />
                  <Box>
                    <Typography fontWeight="bold">Email</Typography>
                    <Typography>cook@gmail.com</Typography>
                  </Box>
                </Paper>
                <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <LocationOnIcon sx={{ mr: 2 }} color="action" />
                  <Box>
                    <Typography fontWeight="bold">Location</Typography>
                    <Typography>MICT Building4</Typography>
                  </Box>
                </Paper>
              </Stack>

              {/* Contact Form - Right Side */}
              <Box component="form" onSubmit={handleSubmit} sx={{ flex: 2 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <TextField
                      fullWidth
                      name="name"
                      label="Name"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      name="phone"
                      label="Phone Number"
                      variant="outlined"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    name="subject"
                    label="Subject"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="message"
                    label="Message"
                    variant="outlined"
                  />
                  {/* <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ bgcolor: "#F57C00", px: 4, color: 'white' }}
                                    >
                                        Send Message
                                    </Button> */}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ bgcolor: "#10B981", px: 4, color: "white" }}
                  >
                    Send Message
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Container>
        </Box>
        {/* Footer */}
        <Box sx={{ bgcolor: "#10B981", color: "#fff", mt: 0, py: 13 }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              {/* Left Column */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  CookCraft
                </Typography>
                <Typography variant="caption">
                  ©2025 FoodBuilt with passion <br />
                  for good food.
                </Typography>
              </Box>

              {/* Middle Column */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" mb={1}>
                  Enter your email to receive relevant messaging tips.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="Email"
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 1,
                      input: { color: "#000" },
                      flex: 1,
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#000", color: "#fff" }}
                  >
                    Send
                  </Button>
                </Stack>
              </Box>

              {/* Right Column */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: { xs: "space-between", sm: "flex-start" },
                  gap: 4,
                  flexWrap: "wrap",
                }}
              >
                {/* Menu */}
                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Menu
                  </Typography>
                  <Typography>Kitchen</Typography>
                  <Typography>Taste</Typography>
                  <Typography>Recipes</Typography>
                </Box>

                {/* Meet Chefs */}
                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Meet Chefs
                  </Typography>
                  <Typography>Alice</Typography>
                  <Typography>Sweet</Typography>
                  <Typography>Anna</Typography>
                </Box>

                {/* Social Media */}
                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Social Media
                  </Typography>
                  <Typography>Facebook</Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
