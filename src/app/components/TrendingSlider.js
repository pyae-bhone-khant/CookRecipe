"use client";

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Slider from "react-slick";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const TrendingSlider = ({ items = [] }) => {
  // Default trending items if none provided
  const defaultItems = [
    {
      title: "Kevin's Famous Spicy Salsa with Mangos",
      author: "By Kevin Josh",
      image: "/images/food1.jpg",
    },
    {
      title: "Classic Italian Seafood Pasta",
      author: "By Maria Rossi",
      image: "/images/food2.jpg",
    },
    {
      title: "Grilled Summer Vegetable Skewers",
      author: "By David Chen",
      image: "/images/food3.jpg",
    },
  ];

  const trendingItems = items.length > 0 ? items : defaultItems;

  // Custom Next Arrow
  const NextArrow = ({ onClick }) => (
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        position: "absolute",
        top: "85%",
        right: 70,
        transform: "translateY(-50%)",
        zIndex: 2,
        textTransform: "none",
        borderColor: "#ff7b00",
        color: "white",
        borderRadius: "50px",
        px: 3,
        "&:hover": { backgroundColor: "#e65100" },
      }}
    >
      <ArrowForwardIosIcon />
    </Button>
  );

  // Custom Previous Arrow
  const PrevArrow = ({ onClick }) => (
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        position: "absolute",
        top: "85%",
        right: 150,
        transform: "translateY(-50%)",
        zIndex: 2,
        textTransform: "none",
        borderColor: "#ff7b00",
        color: "white",
        borderRadius: "50px",
        px: 3,
        "&:hover": { backgroundColor: "#e65100" },
      }}
    >
      <ArrowBackIosNewIcon />
    </Button>
  );

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, position: "relative" }}>
      <Slider {...settings}>
        {trendingItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{
                width: "100%",
                height: { xs: "200px", md: "250px" },
                objectFit: "cover",
              }}
            />

            {/* Left Orange Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: { xs: '30%', md: '25%' },
                background: 'linear-gradient(to right, rgba(255,111,0,0.7), transparent)',
                zIndex: 1,
              }}
            />

            {/* Right Orange Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: { xs: '30%', md: '25%' },
                background: 'linear-gradient(to left, rgba(255,111,0,0.7), transparent)',
                zIndex: 1,
              }}
            />

            {/* Content Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: { xs: "100%", md: "50%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: { xs: 2, md: 6 },
                zIndex: 2,
              }}
            >
              <Typography variant="button" sx={{ color: "white" }}>
                Trending now
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "white", my: 2 }}
              >
                {item.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "white" }}>
                {item.author}
              </Typography>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TrendingSlider;
