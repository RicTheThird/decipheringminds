// src/components/AboutUs.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const AboutUs: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box my={5} textAlign="center">
        <Typography variant="h4" gutterBottom>About Us</Typography>
        <Typography variant="body1">We are a leading company providing top-notch solutions to meet all your needs.</Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
