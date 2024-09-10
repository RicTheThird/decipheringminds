// src/components/Testimonials.tsx
import React from 'react';
import { Box, Typography, Container, Card, CardContent, Grid } from '@mui/material';

const Testimonials: React.FC = () => {
  const testimonials = [
    { name: 'John Doe', feedback: 'This is the best service I have ever used!' },
    { name: 'Jane Smith', feedback: 'Absolutely wonderful experience!' },
    { name: 'Robert Johnson', feedback: 'Highly recommend them for their professionalism.' }
  ];

  return (
    <Container maxWidth="lg">
      <Box my={5}>
        <Typography variant="h4" textAlign="center" gutterBottom>Testimonials</Typography>
        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="body1">{testimonial.feedback}</Typography>
                  <Typography variant="subtitle2" color="textSecondary" textAlign="right">- {testimonial.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Testimonials;
