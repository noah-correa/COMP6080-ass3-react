import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/Auth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateOutlet = () => {
  const { token } = useAuth();

  return token
    ? <Outlet/>
    : <Navigate to='/login'/>;
}

PrivateOutlet.propTypes = {
  children: PropTypes.node,
}

export default PrivateOutlet;
