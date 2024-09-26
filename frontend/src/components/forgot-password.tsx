import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container, CircularProgress, IconButton, InputAdornment, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { forgotPassword, login, PasswordInvalidErrorMessage, resetPassword, validatePassword, verifyToken } from '../services/authService';
import { Email, Visibility, VisibilityOff } from '@mui/icons-material';

const ForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);


  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgottenEmail, setForgottenEmail] = useState('')

  const [resetSuccess, setResetSuccess] = useState(false)

  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [passwordPassed, setPasswordPassed] = useState(true);
  const [tokenValid, setTokenValid] = useState(true);
  const [formValues, setFormValues] = useState({
    newPassword: "",
    confirmPassword: ""
  });


  useEffect(() => {
    const verifyTokenAsync = async () => {
      try {
        const response: any = await verifyToken(token)
        if (response.status > 299) {
          setTokenValid(false)
          setError(response?.response.data)
        } else {
          setTokenValid(true)
        }
      } catch (error) {
        setTokenValid(false)
        setError("Request failed. Please try again later");
      }
    };

    if (token) verifyTokenAsync();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'newPassword') {
      setPasswordPassed(e.target.value !== '' ? validatePassword(e.target.value) : true)
      if (formValues.confirmPassword != '' && e.target.value !== '') {
        setPasswordNotMatch(e.target.value !== formValues.confirmPassword)
      }
    }

    if (e.target.name === 'confirmPassword') {
      if (e.target.value !== formValues.newPassword && e.target.value !== '') {
        setPasswordNotMatch(true)
      } else {
        setPasswordNotMatch(false)
      }
    }
  };

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response: any = await forgotPassword({ email: forgottenEmail })
      if (response.status > 299) {
        setError(response?.response.data)
      } else {
        setForgottenEmail('')
        setSuccess('Reset password link has been sent to your email if it is registered to the system.')
      }
    } catch (e) {
      setError("Request failed. Please try again later");
    } finally {
      setLoading(false)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordPassed || passwordNotMatch) return;
    setLoading(true)
    setError('')
    setSuccess('')
    setResetSuccess(false)
    try {
      const response: any = await resetPassword({ token, newPassword: formValues.newPassword })
      if (response.status > 299) {
        setError(response?.response.data)
      } else {
        setResetSuccess(true)
        setForgottenEmail('')
        setSuccess('We have successfully reset your password. You can now login by clicking below.')
      }
    } catch (error) {
      setError("Request failed. Please try again later")
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
        minHeight="70vh"
        marginTop={isMobile ? 0 : 4}
        textAlign="center"
        bgcolor="white"
        boxShadow={3}
        p={4}
        sx={{ background: "#F4FEFF" }}
        borderRadius={2}
      >

        <Box mb={3}>
          <img
            src="/logo-login.png"
            alt="Logo"
            style={{
              width: isMobile ? '300px' : '350px',
              height: 'auto',
            }}
          />
        </Box>

        <Typography variant="h4" className="gradient-text" style={{ fontWeight: 700 }} gutterBottom>
          DecipheringMinds
        </Typography>

        {error &&
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        }
        {success &&
          <Typography variant="body2" color="success">
            {success}
          </Typography>
        }
        {
          resetSuccess &&
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth

            sx={{ mt: '20px', padding: '10px' }}
            onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        }
        {
          !token && !resetSuccess &&
          <>
            <form onSubmit={sendLink}>
              <Grid container spacing={3} paddingTop={5}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={forgottenEmail}
                    onChange={(e: any) => setForgottenEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ padding: '10px' }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    Send Reset Password Link
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        }
        {
          token && tokenValid && !resetSuccess &&
          <>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} paddingTop={5}>
                {/* Password */}
                <Grid item xs={12}>
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formValues.newPassword}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!passwordPassed}
                    helperText={!passwordPassed ? PasswordInvalidErrorMessage : ''}
                    fullWidth
                    required
                    InputProps={{
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
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword2 ? "text" : "password"}
                    value={formValues.confirmPassword}
                    onChange={handleInputChange}
                    error={passwordNotMatch}
                    helperText={passwordNotMatch ? 'Password does not match' : ''}
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
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
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ padding: '10px' }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    Reset Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        }
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

export default ForgotPassword;
