// src/components/Login.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [loading, setLoading] = useState(false); // Loading state
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  });

  const [loginError, setLoginError] = useState('');


  useEffect(() => {
    if(localStorage.getItem('sessiontimeout')) {
      setLoginError('You have been logged out due to session timeout.')
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response: any = await login({ userName: formValues.userName, password: formValues.password })
      if (response.status === 200) {
        navigate('/home');
      } else {
        setLoginError("Invalid User name or password")
      }
    } catch (error) {
      setLoginError("Invalid User name or password")
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
        {/* Logo */}
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

        {/* Login Form */}
        <Typography variant="h4" className="gradient-text" style={{ fontWeight: 700 }} gutterBottom>
          DecipheringMinds
        </Typography>

        {loginError &&
          <Typography variant="body2" color="error">
            {loginError}
          </Typography>
        }
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            margin="normal"
            name="userName"
            value={formValues.userName}
            onChange={handleInputChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            name='password'
            margin="normal"
            value={formValues.password}
            onChange={handleInputChange}
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, padding: '10px' }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Login
          </Button></form>

        {/* Registration Link */}
        <Box mt={2}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register" underline="hover">
              Register here
            </Link>
          </Typography>
          <Typography mt={2} variant="body2">
            <Link href="/forgot-password" underline="hover">
              Forgot password?
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
