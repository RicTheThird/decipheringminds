import React from 'react';
import { Typography } from '@mui/material';

const DashboardHome: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>
      <Typography variant="body1">
        Welcome to the Home Page of the dashboard.
      </Typography>
    </div>
  );
};

export default DashboardHome;
