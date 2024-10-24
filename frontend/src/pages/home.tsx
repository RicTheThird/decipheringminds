// src/pages/Home.tsx
import React from 'react';
import Banner from '../components/banner';
import AboutUs from '../components/about-us';
import Cards from '../components/cards';
import Testimonials from '../components/testimonials';
import { Box, CssBaseline, Typography } from '@mui/material';
import Footer from '../components/footer';
import ChatUs from '../components/chat-us';

const Home: React.FC = () => {
  return (
    <>
        <CssBaseline />
        <Banner />
       
        <Cards />
        <ChatUs />
        <AboutUs />
        <Testimonials />
           {/* Footer Section */}
        {/* <Box sx={{ bgcolor: 'primary.main', py: 3, mt: 6 }}>
            <Typography color="white" textAlign="center">
            &copy; {new Date().getFullYear()} DecipheringMinds. All rights reserved.
            </Typography>
        </Box> */}
        <Footer />
    </>
  );
};

export default Home;
