import React, { ReactNode } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
interface Props {
    children?: ReactNode
    path? :string
    // any props that come into the component
}
const ProtectedRoute = ({ children, ...rest } : Props) => {

  return (
    <Route
      {...rest}
      element={isAuthenticated() ? children : <Navigate to="/login" />}
    />
  );
};

export default ProtectedRoute;
