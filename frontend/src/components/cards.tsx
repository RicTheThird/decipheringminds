// src/components/Cards.tsx
import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  CardMedia,
} from "@mui/material";

const Cards: React.FC = () => {
  const cardItems = [
    {
      title: "Chat with Expert",
      image: "/chat.png",
      description: "You can connect directly, quickly and easily, and there is no need to doubt the quality of the consultation and treatment offered.",
    },
    {
      title: "Anonymous Identity",
      image: "/chat.png",
      description: "Talk about the health complaints you are experiencing and don't hesitate to ask about the proper treatment",
    },
    {
      title: "Visit Clinic",
      image: "clinic.png",
      description: "Get priority services in hospitals with expert. Which allows you to go to the hospital more practically and save time.",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box my={5}>
        <Typography
          variant="h4"
          component="h4"
          textAlign="center"
          sx={{ fontWeight: 700 }}
          gutterBottom
        >
          Why our <span className="gradient-text">Mental Health</span>{" "}
          Consultants are the Best Choice
        </Typography>
        <Grid container spacing={3} paddingTop={5}>
          {cardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ background: "linear-gradient(180deg, #4BD2D7 26.59%, #0F85A5 54.35%)" }}>
                <CardMedia
                  component="img"
                  
                  image={item.image} // Replace with your image URL
                  alt="Card Image"
                  sx={{
                    borderRadius: "8px",
                    margin: "0 auto",
                    padding: 2,
                    width: "auto"
                  }}
                />
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }} textAlign="center" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }} textAlign="center">{item.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Cards;
