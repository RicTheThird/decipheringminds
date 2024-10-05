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
  Modal,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSearchParams } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  confirmEmail,
  PasswordInvalidErrorMessage,
  register,
  validatePassword,
} from "../services/authService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);
  const token = searchParams.get("token") || "";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const confirmEmailAsync = async () => {
      try {
        const response: any = await confirmEmail(token);
        if (response.status > 299) {
          setError(response?.response.data);
        }
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

  const [error, setError] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [passwordPassed, setPasswordPassed] = useState(true);
  const [isSubmitted, setSubmitted] = useState(false);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    maxHeight: "85vh",
    overflowY: "scroll",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "passwordHash") {
      setPasswordPassed(
        e.target.value !== "" ? validatePassword(e.target.value) : true
      );
      if (formValues.passwordConfirm != "" && e.target.value !== "") {
        setPasswordNotMatch(e.target.value !== formValues.passwordConfirm);
      }
    }

    if (e.target.name === "passwordConfirm") {
      if (e.target.value !== formValues.passwordHash && e.target.value !== "") {
        setPasswordNotMatch(true);
      } else {
        setPasswordNotMatch(false);
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
    if (!passwordPassed || passwordNotMatch) return;
    setLoading(true);
    try {
      const response: any = await register(formValues);
      if (response.status > 299) {
        setError(response?.response.data);
      } else {
        setSubmitted(true);
      }
      console.log(response);
    } catch (e) {
      setError("Failed to register. Please try again later.");
    } finally {
      setLoading(false);
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

        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{
              backgroundColor: "#fbfdda",
              borderColor: "#dfd86e",
              padding: "0.8rem",
            }}
          >
            {error}
          </Typography>
        )}
        {token && !error && (
          <>
            <Typography
              variant="h5"
              className="gradient-text"
              style={{ fontWeight: 700 }}
              gutterBottom
            >
              Email successfully verified
            </Typography>

            {/* Confirmation Message */}
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Thank you! You can now login{" "}
              <Link href="/login" underline="hover">
                here
              </Link>
            </Typography>
          </>
        )}
        {isSubmitted && !token && (
          <>
            <Typography
              variant="h5"
              className="gradient-text"
              style={{ fontWeight: 700 }}
              gutterBottom
            >
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
          <>
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
                    name="passwordHash"
                    type={showPassword ? "text" : "password"}
                    value={formValues.passwordHash}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!passwordPassed}
                    helperText={
                      !passwordPassed ? PasswordInvalidErrorMessage : ""
                    }
                    fullWidth
                    required
                    InputProps={{
                      // <-- This is where the toggle button is added.
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
                      ),
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
                    helperText={
                      passwordNotMatch ? "Password does not match" : ""
                    }
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      // <-- This is where the toggle button is added.
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
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    By registering, you agree to our{" "}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleOpen}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
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
            {/* <Box mt={2}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link href="/login" underline="hover">
                  Login here
                </Link>
              </Typography>
            </Box> */}
          </>
        )}
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="privacy-policy-title"
        aria-describedby="privacy-policy-description"
      >
        <Box sx={modalStyle}>
          <Typography id="privacy-policy-title" variant="h4" component="h2">
            Privacy Policy
          </Typography>
          <Typography id="privacy-policy-description" sx={{ mt: 2 }}>
            DecipheringMinds.com (referred to as "we," "us," or "our") values
            your privacy and is committed to protecting your personal
            information. This Privacy Policy outlines the types of information
            we collect, how we use it, and your rights regarding that
            information.
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            1. Information We Collect
          </Typography>
          <Typography sx={{ mt: 2 }}>
            When you register or interact with DecipheringMinds.com, we collect
            the following types of information:
            <ul>
              <li>
                <strong>Personal Information: </strong>This includes your name,
                email address, username, and any other information you
                voluntarily provide when creating an account.
              </li>
              <li>
                <strong>Usage Data: </strong>We collect data on how you interact
                with our platform, including your browsing history, IP address,
                device information, and the time you spend on the platform.
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong>We use
                cookies and similar tracking technologies to enhance your
                experience on the platform. You can control your cookie
                preferences in your browser settings.
              </li>
            </ul>
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            2. How We Use Your Information
          </Typography>
          <Typography sx={{ mt: 2 }}>
            We use the information we collect to:
            <ul>
              <li>
                Provide and maintain our services, including user registration
                and profile management.
              </li>
              <li>Customize and enhance your user experience.</li>
              <li>
                Communicate with you, including sending notifications and
                updates related to your account or our services.
              </li>
              <li>Analyze site usage to improve performance and features.</li>
              <li>
                Ensure the security of our platform and detect, prevent, and
                address technical issues.
              </li>
            </ul>
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            3. Sharing Your Information
          </Typography>
          <Typography sx={{ mt: 2 }}>
            We do not sell or share your personal information with third parties
            for marketing purposes. However, we may share your data with:
            <ul>
              <li>
                <strong>Service Providers: </strong> Third-party companies who
                assist us in providing and maintaining our services (e.g.,
                hosting services, analytics).
              </li>
              <li>
                <strong>Legal Requirements: </strong>We may disclose your
                information when required by law or to comply with legal
                processes, such as in response to a court order or governmental
                request.
              </li>
            </ul>
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            4. Your Rights
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Depending on your location, you may have the following rights
            regarding your personal data:
            <ul>
              <li>
                <strong>Access and Correction: </strong> You can access, update,
                or correct the personal information we hold about you through
                your account settings.
              </li>
              <li>
                <strong>Data Deletion: </strong>You may request the deletion of
                your personal data by contacting us at
                decipheringminds@gmail.com.
              </li>

              <li>
                <strong>Opt-Out of Marketing: </strong>You may opt out of
                receiving promotional communications by following the
                unsubscribe link in the emails we send or updating your account
                settings.
              </li>
            </ul>
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            5. Retention of Data
          </Typography>
          <Typography sx={{ mt: 2 }}>
            We will retain your personal data only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy or as required
            by law.
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            6. Contact Us
          </Typography>
          <Typography sx={{ mt: 2 }}>
            If you have any questions or concerns about this Privacy Policy or
            our practices, please contact us at:<br />
            <br />
            <strong>DecipheringMinds.com </strong><br/>
            Email: decipheringminds@gmail.com <br/>
          </Typography>
          <br />
          <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Register;
