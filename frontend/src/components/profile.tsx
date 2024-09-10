import React from 'react';
import { Typography } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Profile Page
      </Typography>
      <Typography variant="body1">
        Welcome to the Profile Page of the dashboard.
      </Typography>
    </div>
  );
};

export default Profile;
