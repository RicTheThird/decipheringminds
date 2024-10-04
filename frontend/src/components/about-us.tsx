// src/components/AboutUs.tsx
import React from 'react';
import { Box, Typography, Card, Grid, Avatar, CardContent } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Slider from 'react-slick';
import { styled } from '@mui/system';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample Data
const cardData = [
  {
    name: 'Cheyenne Asis', role: 'Project Manager',
    description: 'Cheyenne leads the team with a strategic vision, ensuring that every milestone aligns with our goal of impactful insights and solutions.',
    avatar: '/cheyn.jfif'
  },
  {
    name: 'Selwyn Centeno', role: 'Researcher',
    description: 'Selwyn dives deep into data and emerging trends, driving the research behind our initiatives with a focus on accuracy and innovation.',
    avatar: '/selwyn.jpg'
  },
  {
    name: 'Ray Vincent Narvaez', role: 'Developer',
    description: 'Rsy turns our ideas into reality by building robust software solutions, combining technical expertise with a passion for mental health.',
    avatar: '/ray.jpg'
  },
  {
    name: 'Hugh Montablan', role: 'UI/UX Designer',
    description: 'Hugh ensures that our platform is intuitive and user-friendly, designing experiences that make interacting with our tools both seamless and enjoyable.',
    avatar: '/hugh.jpg'
  },
];

const StyledCard = styled(Card)({
  backgroundColor: '#F4FEFF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  margin: '0 10px', // Add horizontal margin here
  width: '100%'
});

const AboutUs: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // Enable auto-scrolling
    autoplaySpeed: 3000, // Time in milliseconds between each slide
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    // <Container maxWidth="md">
    //     <Typography variant="h4" gutterBottom>About Us</Typography>
    //     <Typography variant="body1">We are a leading company providing top-notch solutions to meet all your needs.</Typography>
    //   </Box>
    // </Container>
    <>

      <Box sx={{ backgroundColor: "#F4FEFF", paddingTop: '10px', paddingBottom: '50px' }}>

        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>About Us</Typography>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{ paddingLeft: "10vw", paddingRight: "10vw" }}
          alignItems="center"
        >
          {/* Right Side - Image */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "center" }}>
              <img
                src="/aboutus-banner.png"
                alt="Banner"
                style={{ width: "80%", height: "auto", borderRadius: "8px" }}
              />
            </Box>
          </Grid>
          {/* Left Side - Text */}
          <Grid item xs={12} md={6}>
            <Box sx={{ padding: "20px" }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 700 }}
                gutterBottom
              >
                Discover the Faces Behind Our&nbsp;
                <span className="gradient-text">Mental Health</span> Consultancy
              </Typography>
              <Typography variant="body1">
                At Deciphering Minds, we are a passionate and dedicated team focused on unraveling the complexities of human thought and behavior through innovative technology and research. Our mission is to create tools that empower individuals and organizations to better understand psychological patterns and mental well-being, ultimately fostering healthier communities.
              </Typography>
            </Box>


          </Grid>

          <Grid item xs={12} md={12}>
            <Box textAlign="center">
              <Typography variant="h5" gutterBottom>Meet our Experts</Typography>
            </Box>
            <Box sx={{ paddingBottom: '20px'}}>
              <Slider {...settings}>
                {cardData.map((item, index) => (
                  <div>
                    <StyledCard key={index}>
                      <CardContent>
                        <Avatar style={{ textAlign: 'center', width: '100px', height: 'auto', marginBottom: '10px' }} alt={item.name} src={item.avatar} />
                        <Typography variant="h6" component="h2">
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          {item.role}
                        </Typography>
                        <Typography style={{ marginTop: '10px' }} variant="body2" gutterBottom>
                          {item.description}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </div>
                ))}
              </Slider>
            </Box>
          </Grid>


        </Grid>
      </Box></>
  );
};

export default AboutUs;
