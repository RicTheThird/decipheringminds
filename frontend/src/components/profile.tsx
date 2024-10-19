import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { changePassword, myProfile, PasswordInvalidErrorMessage, updateProfile, validatePassword } from '../services/authService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { handleKeyDownOnlyNumeric } from '../utils/validation';

const Profile = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthdate, setBirthdate] = useState(dayjs());
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profile, setUserProfile] = useState<any>(null)
  const [snackOpen, setSnackOpen] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [passwordPassed, setPasswordPassed] = useState(true);

  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const handleClickShowPasswordCurrent = () => setShowPasswordCurrent(!showPasswordCurrent);
  const handleMouseDownPasswordCurrent = () => setShowPasswordCurrent(!showPasswordCurrent);

  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const handleClickShowPasswordNew = () => setShowPasswordNew(!showPasswordNew);
  const handleMouseDownPasswordNew = () => setShowPasswordNew(!showPasswordNew);

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
  const handleMouseDownPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);

  const [passwordForm, setPasswordForm] = useState({
    currentPw: "",
    newPw: "",
    newPwConfirm: ""
  });

  useEffect(() => {
    getMyProfile();
  }, []);

  const getMyProfile = async () => {
    const response = await myProfile();
    setBirthdate(dayjs(response.birthDate))
    setPhoneNumber(response.phoneNumber)
    setUserProfile(response);
  }

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleBirthdateChange = (date: any) => {
    setBirthdate(date);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "newPw") {
      setPasswordPassed(
        e.target.value !== "" ? validatePassword(e.target.value) : true
      );
      if (passwordForm.newPwConfirm != "" && e.target.value !== "") {
        setPasswordNotMatch(e.target.value !== passwordForm.newPwConfirm);
      }
    }

    if (e.target.name === "newPwConfirm") {
      if (e.target.value !== passwordForm.newPw && e.target.value !== "") {
        setPasswordNotMatch(true);
      } else {
        setPasswordNotMatch(false);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const bdate = dayjs(birthdate).format('YYYY-MM-DD')
    const request = {
      phoneNumber,
      birthDate: bdate
    };
    try {
      await updateProfile(request);
      setAlert({ message: 'Successfully updated profile', success: true })

    } catch (e) {
      console.log(e);
      setAlert({ message: 'Failed to update profile. Please try again later.', success: false })
    } finally {
      setSnackOpen(true)
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordPassed || passwordNotMatch) return;
    setIncorrectPassword(false)
    try {
      var response = await changePassword({ currentPassword: passwordForm.currentPw, newPassword: passwordForm.newPw })
      if (response.status === 400) {
        setIncorrectPassword(true)
        setAlert({ message: 'Failed to reset password. Incorrect password given', success: false })
      } else if (response.status <= 299) {
        setAlert({ message: 'Successfully reset password.', success: true })
        setPasswordForm({
          currentPw: "",
          newPw: "",
          newPwConfirm: ""
        });
      } else {
        setAlert({ message: 'Failed to reset password. Please try again later', success: false })
      }
    } catch (e) {
      console.log(e);
      setAlert({ message: 'Failed to reset password. Please try again later', success: false })
    } finally {
      setSnackOpen(true)
    }
  };


  return (
    <Container>
      {/* <Paper elevation={3} style={{ padding: '20px' }}> */}
      <Typography variant="h4" gutterBottom>
        Account Maintenance
      </Typography>

      <form onSubmit={handleUpdateProfile}>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              aria-readonly
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={profile?.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              aria-readonly
              variant="filled"

              InputLabelProps={{ shrink: true }}
              fullWidth
              value={profile?.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              aria-readonly
              variant="filled"

              InputLabelProps={{ shrink: true }}
              fullWidth
              value={profile?.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Gender"
              aria-readonly
              variant="filled"

              InputLabelProps={{ shrink: true }}
              fullWidth
              value={profile?.gender}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              inputProps={{ maxlength: 11}} 
              type='text'
              onKeyDown={handleKeyDownOnlyNumeric}
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                maxDate={dayjs()}
                format='YYYY-MM-DD'
                label="Select Birth Date"
                value={birthdate}
                onChange={handleBirthdateChange}
                slots={{
                  textField: (textFieldProps) => (
                    <TextField fullWidth required {...textFieldProps} />
                  ),
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type='submit'
              fullWidth
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>

      </form>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Reset Password
      </Typography>

      <form onSubmit={handleResetPassword}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Currrent Password"
              name="currentPw"
              type={showPasswordCurrent ? "text" : "password"}
              value={passwordForm.currentPw}
              onChange={handleInputChange}
              variant="outlined"
              error={incorrectPassword}
              helperText={
                incorrectPassword ? "Incorrect password" : ""
              }
              fullWidth
              required
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordCurrent}
                      onMouseDown={handleMouseDownPasswordCurrent}
                    >
                      {showPasswordCurrent ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="New Password"
              name="newPw"
              type={showPasswordNew ? "text" : "password"}
              value={passwordForm.newPw}
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
                      onClick={handleClickShowPasswordNew}
                      onMouseDown={handleMouseDownPasswordNew}
                    >
                      {showPasswordNew ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm New Password"
              name="newPwConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              value={passwordForm.newPwConfirm}
              onChange={handleInputChange}
              variant="outlined"
              error={passwordNotMatch}
              helperText={
                passwordNotMatch ? "Password does not match" : ""
              }
              fullWidth
              required
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordConfirm}
                      onMouseDown={handleMouseDownPasswordConfirm}
                    >
                      {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              type='submit'
              fullWidth
            >
              Reset Password
            </Button>
          </Grid>
        </Grid>
      </form>
      {/* </Paper> */}

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={alert?.success ? "success" : "error"} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Container >
  );
};

export default Profile;
