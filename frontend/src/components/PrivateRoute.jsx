import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/Auth';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  return token
    ? children
    : <Navigate to='/login'/>;
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
}

export default PrivateRoute;
