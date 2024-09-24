// src/components/Login.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  Grid,
  MenuItem,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSearchParams } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { confirmEmail, register } from "../services/authService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordInvalidErrorMessage = "Password must be at least 8 characters long, contain at least one uppercase and lowercase, a number and a special character."
function validatePassword(password: string): boolean {
  // Minimum password length
  const minLength = 8;

  // Regular expressions for validation criteria
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Validate password
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  );
}

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);
  const token = searchParams.get('token') || '';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false); // Loading state
  useEffect(() => {
    // Function to fetch data
    const confirmEmailAsync = async () => {
      try {
        await confirmEmail(token)
      } catch (error) {
        setError("Invalid token");
      }
    };

    if (token) confirmEmailAsync();
  }, []);

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    birthDate: null,
    gender: "",
    email: "",
    passwordHash: "",
    passwordConfirm: "",
  });

  const [error, setError] = useState('');
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [passwordPassed, setPasswordPassed] = useState(true);
  const [isSubmitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'passwordHash') {
      setPasswordPassed(e.target.value !== '' ? validatePassword(e.target.value) : true)
      if (formValues.passwordConfirm != '' && e.target.value !== '') {
        setPasswordNotMatch(e.target.value !== formValues.passwordConfirm)
      }
    }

    if (e.target.name === 'passwordConfirm') {
      if (e.target.value !== formValues.passwordHash && e.target.value !== '') {
        setPasswordNotMatch(true)
      } else {
        setPasswordNotMatch(false)
      }
    }
  };

  const handleDateChange = (date: any) => {
    setFormValues({
      ...formValues,
      birthDate: date,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!passwordPassed || passwordNotMatch) return;
    console.log(formValues);
    setLoading(true)
    try {
      await register(formValues);
      setSubmitted(true);
    } catch (e) {
      setError('Failed to register. Please try again later.')
    } finally {
      setLoading(false)
    }
  };

  return (
    <Container maxWidth={isMobile ? "xs" : "sm"}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        marginTop={2}
        marginBottom={2}
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



        {error &&
          <Typography variant="h5" color="error">
            {error}
          </Typography>
        }
        {token && !error && (
          <>
            <Typography variant="h5" className="gradient-text"
              style={{ fontWeight: 700 }} gutterBottom>
              Email successfully verified
            </Typography>

            {/* Confirmation Message */}
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Thank you! You can now login <Link href="/login" underline="hover">here
              </Link>
            </Typography>
          </>
        )}
        {isSubmitted && !token && (
          <>
            <Typography variant="h5" className="gradient-text"
              style={{ fontWeight: 700 }} gutterBottom>
              Registration Successful!
            </Typography>

            {/* Confirmation Message */}
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Thank you for registering. Please check your email to confirm your
              account.
            </Typography>
          </>
        )}

        {!isSubmitted && !token && (
          <><Typography
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
                    name="passwordHash"
                    type={showPassword ? "text" : "password"}
                    value={formValues.passwordHash}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!passwordPassed}
                    helperText={!passwordPassed ? PasswordInvalidErrorMessage : ''}
                    fullWidth
                    required
                    InputProps={{ // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12}>
                  <TextField
                    label="Confirm Password"
                    name="passwordConfirm"
                    type={showPassword2 ? "text" : "password"}
                    value={formValues.passwordConfirm}
                    onChange={handleInputChange}
                    error={passwordNotMatch}
                    helperText={passwordNotMatch ? 'Password does not match' : ''}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{ // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword2}
                            onMouseDown={handleMouseDownPassword2}
                          >
                            {showPassword2 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
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
          </>
        )}

      </Box>
    </Container>
  );
};

export default Register;
