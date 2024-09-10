// src/components/Login.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  Grid,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    birthDate: null,
    gender: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: any) => {
    setFormValues({
      ...formValues,
      birthDate: date,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, validation, etc.
    console.log(formValues);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        marginTop={4}
        textAlign="center"
        bgcolor="white"
        boxShadow={3}
        p={4}
        sx={{ background: "#F4FEFF" }}
        borderRadius={2}
      >
        {/* Logo */}
        <Box mb={3}>
          <img
            src="/logo-login.png"
            alt="Logo"
            style={{
              width: isMobile ? "300px" : "350px",
              height: "auto",
            }}
          />
        </Box>

        <Typography
          variant="h4"
          className="gradient-text"
          style={{ fontWeight: 700 }}
          gutterBottom
        >
          DecipheringMinds
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} paddingTop={5}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formValues.lastName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* Birth Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Birth Date"
                  value={formValues.birthDate}
                  onChange={handleDateChange}
                  slots={{
                    textField: (textFieldProps) => (
                      <TextField fullWidth required {...textFieldProps} />
                    ),
                  }}
                  //slots={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gender"
                name="gender"
                value={formValues.gender}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                select
                sx={{ textAlign: "left" }}
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                name="confirm-password"
                type="password"
                value={formValues.password}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
