// src/components/Login.tsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false); // Loading state
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  });

  const [loginError, setLoginError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    // Login logic here
    e.preventDefault();
    setLoading(true)
    try {
      await login(formValues.userName, formValues.password)
      navigate('/home');
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
            type="password"
            fullWidth
            required
            name='password'
            margin="normal"
            value={formValues.password}
            onChange={handleInputChange}
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
            <Link href="/register" underline="hover">
              Forgot password?
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
