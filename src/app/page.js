


"use client";

import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import { motion, useScroll, useSpring } from "framer-motion"; 


// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Link as MuiLink, Divider,
  IconButton
} from '@mui/material';

import { Facebook } from '@mui/icons-material';

// Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import DinnerDiningOutlinedIcon from '@mui/icons-material/DinnerDiningOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';

import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';

// React Slick Carousel
import Slider from 'react-slick';


const Navbar = ({ scrollToTop, scrollToRecipes, scrollToAbout, scrollToContact, activeSection, setActiveSection }) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#0F172A',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10B981' }}>
          COOKCRAFT
        </Typography>
        <Box sx={{ display: { md: 'flex' }, gap: 2 }}>

          {/* Home */}
          <Button
            color="inherit"
            onClick={() => {
              scrollToTop();

              setActiveSection('home');
            }}
            sx={{
              cursor: 'pointer',
              color: activeSection === 'home' ? '#10B981' : 'inherit',
            }}
          >
            Home
          </Button>

          {/* <Button color="inherit" component={Link} href="#">Home</Button> */}

          {/* Recipes */}
          <Button
            color="inherit"
            onClick={scrollToRecipes}
            sx={{
              cursor: 'pointer',
              color: activeSection === 'recipes' ? '#10B981' : 'inherit',
            }}
          >
            Recipes
          </Button>

          {/* About */}
          <Button
            color="inherit"
            onClick={scrollToAbout}
            sx={{
              cursor: 'pointer',
              color: activeSection === 'about' ? '#10B981' : 'inherit',
            }}
          >
            About
          </Button>


          {/* Contact Us */}
          <Button
            color="inherit"
            onClick={scrollToContact}
            sx={{
              cursor: 'pointer',
              color: activeSection === 'contact' ? '#10B981' : 'inherit',
            }}
          >
            Contact us
          </Button>

        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Link href="/users/sign-up" passHref>
            <Button variant="contained" sx={{
              backgroundColor: '#10B981',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              transition: 'transform 0.3s',

              '&:hover': {
                backgroundColor: '#059669',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
              }
            }}>
              Sign up
            </Button>
          </Link>
          <Link href="/users/sign-in" passHref>
            <Button variant="outlined" sx={{
              borderColor: '#10B981',
              color: '#10B981',
              borderRadius: '12px',
              textTransform: 'none',
              transition: 'transform 0.3s',
              '&:hover': {
                backgroundColor: '#10B981',
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
              }
            }}>
              Log in
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );


};

// Carousel Arrows
const NextArrow = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="outlined"
    sx={{
      position: 'absolute',
      top: '85%',
      right: 70,
      transform: 'translateY(-50%)',
      zIndex: 2,
      textTransform: 'none',
      borderColor: '#10B981',
      color: '#10B981',
      borderRadius: '12px',
      px: 3,
      '&:hover': { backgroundColor: '#10B981', color: 'white' }
    }}
  >
    <ArrowForwardIosIcon />
  </Button>
);

const PrevArrow = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="outlined"
    sx={{
      position: 'absolute',
      top: '85%',
      right: 150,
      transform: 'translateY(-50%)',
      zIndex: 2,
      textTransform: 'none',
      borderColor: '#10B981',
      color: '#10B981',
      borderRadius: '12px',
      px: 3,
      '&:hover': { backgroundColor: '#10B981', color: 'white' }
    }}
  >
    <ArrowBackIosNewIcon />
  </Button>
);

// Carousel Component
const trendingItems = [
  { title: "Kevin's Famous Spicy Salsa with Mangos", author: "By Kevin Josh", image: "/images/food1.jpg" },
  { title: "Classic Italian Seafood Pasta", author: "By Maria Rossi", image: "/images/food2.jpg" },
  { title: "Grilled Summer Vegetable Skewers", author: "By David Chen", image: "/images/food3.jpg" }
];


const TrendingSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    speed: 800,
    cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth easing function
    useCSS: true, // Hardware accelerated animations
    useTransform: true, // CSS transforms သုံးမယ်
    fade: true, // Fade effect ထည့်ချင်ရင် (optional)
    pauseOnHover: true, // Hover လုပ်ရင် autoplay ခဏရပ်မယ်
  };


  return (
    <Box sx={{
      p: { xs: 2, md: 4 }, position: 'relative', mt: 3,
      '.slick-slide': {
        transition: 'all 1000ms ease', // Additional transition
      },
      '.slick-active': {
        opacity: 1,
      }
    }}>
      <Slider {...settings}>
        {trendingItems.map((item, index) => (
          <Box key={index} sx={{
            position: 'relative', borderRadius: '20px', overflow: 'hidden',
            transition: 'opacity 1000ms ease' // Slide transition
          }}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{ width: '100%', height: { xs: '200px', md: '250px' }, objectFit: 'cover' }}
            />

            {/* Left Orange Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                left: 0, top: 0,
                bottom: 0,
                width: { xs: '30%', md: '25%' },
                background: 'linear-gradient(to right, rgba(16,185,129,0.7), transparent)',
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
                background: 'linear-gradient(to left, rgba(16,185,129,0.7), transparent)',
                zIndex: 1,
              }}
            />

            <Box sx={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: { xs: '100%', md: '50%' },
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center',
              p: { xs: 2, md: 6 },
              zIndex: 2
            }}>
              <Typography variant="button" sx={{ color: 'white' }}>Trending now</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', my: 2 }}>
                {item.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'white' }}>{item.author}</Typography>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

// Taste of Food Section
const FoodCategoryCard = ({ icon, title, description }) => (
  <Card sx={{
    height: '100%', p: 2, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',

    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid transparent',
    transition: 'border-color 0.3s ease',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: '#10B981',
      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
    },


  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      <Box sx={{ mr: 2, color: '#10B981' }}>{icon}</Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: '600', color: '#10B981' }}>{title}</Typography>
        <Typography variant="body2" color="black">{description}</Typography>
      </Box>
    </Box>
  </Card>
);

const TasteOfFood = () => {
  const foodItems = [
    { icon: <RestaurantMenuOutlinedIcon sx={{ fontSize: 40 }} />, title: 'Breakfast', description: 'You can choose from a variety of healthy breakfast menus.' },
    { icon: <LunchDiningOutlinedIcon sx={{ fontSize: 40 }} />, title: 'Lunch', description: 'You can easily prepare quick and delicious lunch dishes.' },
    { icon: <DinnerDiningOutlinedIcon sx={{ fontSize: 40 }} />, title: 'Dinner', description: 'We have prepared a wide variety of dinner dishes.' },
    { icon: <GrassOutlinedIcon sx={{ fontSize: 40 }} />, title: 'Salad', description: 'Healthy and delicious salads with fresh vegetables.' },
    { icon: <CakeOutlinedIcon sx={{ fontSize: 40 }} />, title: 'Dessert', description: 'Delicious desserts for you to enjoy.' }
  ];

  return (
    <Box sx={{
      py: 7 //---------------------------------------------------

    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" sx={{
          fontWeight: 'bold',
          mb: 6,
          color: '#10B981'
        }}>
          Taste of Food
        </Typography>
        <Grid container spacing={3} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
          {foodItems.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', width: "350px", height: "100px", my: 2 }} >
              <FoodCategoryCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

//  Recipes component
const PopularRecipes = () => {
  // Hard-coded recipe data with different titles, authors and images
  const recipes = [
    {
      title: "Steamed Sticky Rice",
      author: "By Paste de Italia",
      image: "/images/sticky-rice.jpg" // placeholder path
    },
    {
      title: "Spicy Thai Basil Chicken",
      author: "By Chef Somchai",
      image: "/images/thai-chicken.jpg"
    },
    {
      title: "Classic Beef Burger",
      author: "By Burger Master",
      image: "/images/beef-burger.jpg"
    },
    {
      title: "Vegetable Spring Rolls",
      author: "By Green Eats",
      image: "/images/spring-rolls.jpg"
    },
    {
      title: "Chocolate Lava Cake",
      author: "By Sweet Tooth",
      image: "/images/lova-cake.jpg"
    },
    {
      title: "Miso Ramen",
      author: "By Ramen King",
      image: "/images/miso-ramen.jpg"
    }
  ];

  return (
    <Box sx={{
      py: 13, //------------------------------------------------
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" sx={{
          fontWeight: 'bold',
          mb: 6,
          color: '#10B981',
          textAlign: 'center'
        }}>
          Popular Recipes
        </Typography>

        <Grid container spacing={3} sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
        >
          {recipes.map((recipe, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} sx={{
              maxWidth: '350px', // ဒါမှမဟုတ် width: '100%'
              flexBasis: 'calc(33.333% - 24px)' // 3 columns ဖြစ်အောင်
            }}
            >
              <Card sx={{
                height: '100%',
                borderRadius: '16px',
                border: '2px solid transparent',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transition: 'transform 0.5s',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: '#10B981',
                  boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
                }
              }}>
                {/* Placeholder for image - replace with your actual images */}
                {/* <Box sx={{ 
                  height: '160px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  [Image: {recipe.image}]
                </Box> */}

                {/* Image part */}
                <Box
                  component="img"
                  src={recipe.image}
                  alt={recipe.title}
                  sx={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                />

                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    color: 'black'
                  }}>
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#10B981',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                    {recipe.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Why Choose Us Section Component
const WhyChooseUs = () => {
  const features = [
    {
      title: "Passion for Taste",
      description: "We are dedicated to creating dishes with incredible flavor profiles, making every meal a journey for your taste buds.",
      icon: <RestaurantMenuOutlinedIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Super Quality",
      description: "We prioritize the highest quality ingredients ensuring freshness, authenticity, and superior taste in all our prepared foods.",
      icon: <GradeOutlinedIcon sx={{ fontSize: 40 }} />,
      isHighlighted: true // Add this flag for highlighted card
    },
    {
      title: "Healthy and Wholesome",
      description: "Delicious food that's also good for you, prepared with care and nutritional balance in mind.",
      icon: <HealthAndSafetyOutlinedIcon sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Box sx={{
      py: 13,  //------------------------------------------------------

    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" sx={{
          fontWeight: 'bold',
          mb: 6,
          color: '#10B981'
        }}>
          Why Choose Us?
        </Typography>

        <Grid container spacing={3} sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
        >
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} sx={{
              display: 'flex',
              justifyContent: 'center',
              '&:hover': {
                '& .feature-card': {
                  backgroundColor: '#ff6f00',
                  '& .feature-icon': { color: 'white' },
                  '& .feature-title': { color: 'white' },
                  '& .feature-desc': { color: 'white' }
                }
              }
            }}
            >
              <Card sx={{

                p: 3,
                borderRadius: '16px',
                border: '2px solid transparent',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
                maxWidth: '300px',
                transition: 'transform 0.5s',
                transition: 'all 0.5s ease',

                backgroundColor: feature.isHighlighted ? '#10B981' : 'white',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: '#10B981',
                  boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
                }
              }}>
                <Box className="feature-icon" sx={{
                  mb: 2,
                  color: feature.isHighlighted ? 'white' : '#10B981'
                }}>
                  {/* {feature.icon} */}

                  {React.cloneElement(feature.icon, {
                    sx: {
                      fontSize: 40
                      // color: feature.isHighlighted ? 'white' : '#ff6f00'
                    }

                  })}
                </Box>
                <Typography className="feature-title" variant="h5" sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: feature.isHighlighted ? 'white' : '#10B981'
                }}>
                  {feature.title}
                </Typography>
                <Typography className="feature-desc" variant="body1" sx={{
                  //  color: 'black' 
                  color: feature.isHighlighted ? 'white' : 'black'
                }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Fixed Background Section Component
const CallToActionSection = () => {
  return (
    <Box sx={{
      position: 'relative',
      height: '400px',
      backgroundImage: 'url(/images/food-background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        zIndex: 1
      }
    }}>
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '600px',
        px: 3
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          mb: 3,
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          Learn new recipes, share your own creations, join CookCraft
        </Typography>
        <Link href="/users/sign-up" passHref>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#10B981',
              color: 'white',
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              '&:hover': {
                backgroundColor: '#059669',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Sign Up
          </Button>
        </Link>
      </Box>
    </Box>
  );
};


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#10B981',
        color: 'white',
        py: 6,
        mt: 12,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Newsletter Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="white" >
            Enter your email to receive relevant messaging tips.
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Email"
              size="small"
              sx={{
                width: { xs: '100%', sm: 300 },
                border: '2px solid white',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                }
              }}
            />
            <Button
              variant="outlined"
              color="white"
              type="submit"
              sx={{
                borderRadius: '12px',
                px: 3,
                border: '2px solid white',
                backgroundColor: '#059669',
                '&:hover': {
                  backgroundColor: '#047857',
                }
              }}
            >
              Send
            </Button>
          </Box>
        </Box>

        {/* Links Section */}
        <Grid container spacing={4} justifyContent="space-between" sx={{ mb: 4 }}>
          {/* Brand Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
              CookCraft
            </Typography>
            <Typography variant="body2" color="white">
              Blast with passion for good food
            </Typography>
          </Grid>

          {/* Menu Column */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Menu
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
              <li>
                <MuiLink
                  variant="body1"
                  href="#"
                  color="white"
                  underline="hover"
                  component={Link}
                  sx={{
                    '&:hover': { color: '#D1FAE5' }
                  }}
                >
                  Kitchen
                </MuiLink>
              </li>
              <li>
                <MuiLink
                  href="#"
                  variant="body1"
                  color="white"
                  underline="hover"
                  component={Link}
                  sx={{
                    '&:hover': { color: '#D1FAE5' }
                  }}
                >
                  Taste
                </MuiLink>
              </li>
              <li>
                <MuiLink
                  href="#"
                  variant="body1"
                  color="white"
                  underline="hover"
                  component={Link}
                  sx={{
                    '&:hover': { color: '#D1FAE5' }
                  }}
                >
                  Recipes
                </MuiLink>
              </li>
            </Box>
          </Grid>

          {/* Chefs Column */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Meet Chefs
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
              <li>
                <MuiLink
                  href="#"
                  variant="body1"
                  color="white"
                  underline="hover"
                  component={Link}
                  sx={{
                    '&:hover': { color: '#D1FAE5' }
                  }}
                >
                  Alice
                </MuiLink>
              </li>
              <li>
                <MuiLink
                  href="#"
                  variant="body1"
                  color="white"
                  underline="hover"
                  component={Link}
                  sx={{
                    '&:hover': { color: '#D1FAE5' }
                  }}
                >
                  Sweet
                </MuiLink>
              </li>
              <li>
                <MuiLink
                  href="#"
                  variant="body1"
                  color="white"
                  underline="hover"
                  component={Link}
                  sx={{
                    '&:hover': { color: '#D1FAE5' }
                  }}
                >
                  Anna
                </MuiLink>
              </li>
            </Box>
          </Grid>

          {/* Social Media Column */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Social Media
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href="#"


                component={Link}
                sx={{

                  color: 'white',
                  '&:hover': {
                    color: '#D1FAE5',

                  }
                }}
              >
                <Facebook />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Facebook
                </Typography>
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Divider sx={{ my: 2, background: 'white' }} />
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Typography variant="body2" color="white">
            Copyright &copy; cookcraft2025
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};


// Main Page
export default function HomePage() {
  const recipesRef = React.useRef(null);
  const aboutRef = React.useRef(null);
  const footerRef = React.useRef(null);
  const homeRef = React.useRef(null);

  // Framer Motion scroll animation အတွက်
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = React.useState('home');

  const scrollToTop = () => {
    homeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',

    });
    setActiveSection('home');
  };

  const scrollToRecipes = () => {
    recipesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToContact = () => {
    footerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  

  React.useEffect(() => {
    const sections = [
      { id: 'home', ref: homeRef }, // Home section
      { id: 'recipes', ref: recipesRef },
      { id: 'about', ref: aboutRef },
      { id: 'contact', ref: footerRef },
    ];

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      // threshold: 0.5,
      threshold: [0.3, 0.5, 0.7],
    };

    // const observerCallback = (entries) => {
    //   entries.forEach(entry => {
    //     if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
    //       setActiveSection(entry.target.dataset.section);
    //     }
    //   });
    // };

    const observerCallback = (entries) => {
      let mostVisible = null;
      let highestRatio = 0;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
          highestRatio = entry.intersectionRatio;
          mostVisible = entry.target.dataset.section;
        }
      });

      if (mostVisible) {
        setActiveSection(mostVisible);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.dataset.section = id;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);
  

  return (
    <>


      <Navbar
        scrollToTop={scrollToTop}
        scrollToRecipes={scrollToRecipes}
        scrollToAbout={scrollToAbout}
        scrollToContact={scrollToContact}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

       <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div ref={homeRef}>
          <Container>
            <TrendingSlider />
          </Container>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <TasteOfFood />
        </motion.div>

        <div ref={recipesRef}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <PopularRecipes />
          </motion.div>
        </div>

        <div ref={aboutRef}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <WhyChooseUs />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <CallToActionSection />
        </motion.div>

        <div ref={footerRef}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Footer />
          </motion.div>
        </div>
      </motion.main>
    </>
  );
}
