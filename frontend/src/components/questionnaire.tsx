import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";

const Questionnaire: React.FC = () => {
  const questionnaireItems = [
    {
      title: "GAD 7",
      description:
        "Thank you for considering our anxiety assessment. It's a valuable tool to help understand your feelings and experiences. By taking this assessment, you're taking a proactive step towards self-awareness and potential support. Remember, your privacy is our priority, and your results will be kept confidential. Take your time, and if you have any questions or concerns, feel free to reach out to us. We're here to help.",
    },
    {
      title: "PHQ-9",
      description:
        "Thank you for considering our depression assessment. Your privacy is important, and your results will remain confidential. If you have any questions, we're here to help",
    },
    {
      title: "DASS",
      image: "clinic.png",
      description:
        "Thank you for considering our Depression, Anxiety, and Stress Scales assessment. Your privacy is important, and your results will remain confidential. If you have any questions, we're here to help",
    },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Questionnaire
      </Typography>
      <Typography variant="body1" paddingTop={5}>
        <Grid container spacing={3}>
          {questionnaireItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  background:
                    "linear-gradient(180deg, #4BD2D7 26.59%, #0F85A5 54.35%)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "white" }}
                    textAlign="left"
                    gutterBottom
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "white" }}
                    textAlign="center"
                  >
                    {item.description}
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

export default Questionnaire;
