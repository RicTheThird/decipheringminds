import React from 'react';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

const PyschReport: React.FC = () => {
  const cardItems = [
    {
      title: "Anxiety",
      image: "/anxiety.png",
      description: "You can connect directly, quickly and easily, and there is no need to doubt the quality of the consultation and treatment offered.",
    },
    {
      title: "Depression",
      image: "/depression.png",
      description: "Talk about the health complaints you are experiencing and don't hesitate to ask about the proper treatment",
    },
    {
      title: "Trauma",
      image: "/trauma.png",
      description: "Get priority services in hospitals with expert. Which allows you to go to the hospital more practically and save time.",
    },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Psych Report
      </Typography>
      <Typography variant="body1" paddingTop={5}>
        <Grid container spacing={3} paddingTop={5}>
          {cardItems.map((item, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <Card
                sx={{
                  background:
                    "linear-gradient(180deg, #4BD2D7 26.59%, #0F85A5 54.35%)",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    paddingTop: '10px',
                    width: '30%',
                    height: 'auto',
                    objectFit: 'contain',  // Ensure image is contained within the card
                    display: 'block',      // Remove inline-block spacing
                    margin: '0 auto',      // Horizontally center image
                  }}
                  image={item.image}
                  alt="Card Image"
                />

                {/* Label */}
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ textAlign: "center", color: "white" }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Typography>
    </div>
  );
};

export default PyschReport;
