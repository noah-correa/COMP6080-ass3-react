import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { MdOutlineLogout } from 'react-icons/md';

export const LogoutButtonWrapper = styled(Button)`
  color: white;
  background-color: #25076b;
  border: none;
  &:hover, &:focus {
    background-color: #46178f;
  };
`;

const Logout = ({ token, logout, onLogout }) => {
  const handleLogout = async (event) => {
    event.preventDefault();
    const data = await logout(token);
    if (!data.error) {
      onLogout();
    } else {
      console.error('Invalid token');
    }
  }

  return (
    <LogoutButtonWrapper id='button-logout' variant='secondary' onClick={handleLogout}>
      <MdOutlineLogout/> Logout
    </LogoutButtonWrapper>
  )
}

Logout.propTypes = {
  token: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}

export default Logout;
