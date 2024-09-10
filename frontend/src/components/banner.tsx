import React from "react";
import { Grid, Typography, Box } from "@mui/material";

const Banner: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#F4FEFF", padding: "50px 0" }}>
      <Grid
        container
        spacing={2}
        sx={{ paddingLeft: "10vw", paddingRight: "10vw" }}
        alignItems="center"
      >
        {/* Left Side - Text */}
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: "20px" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700 }}
              gutterBottom
            >
              Healthy Minds, Happy Lives{" "}
              <span className="gradient-text">Mental Health</span> Consultancy
            </Typography>
            <Typography variant="body1">
              Welcome to DecipheringMinds, your haven for mental wellness!<br/>
              Explore resources, find support, and connect with a community
              dedicated to nurturing mental health and well-being.
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Image */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src="/banner.png"
              alt="Banner"
              style={{ width: "80%", height: "auto", borderRadius: "8px" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Banner;
