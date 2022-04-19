import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';

const HeaderWrapper = styled.header`
  background-color: #25076b;
  z-index: 5;
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  position: sticky;
  top: 0;
  color: white;
  padding-left: 15px;
`;

const HeaderButton = styled.h2`
  cursor: pointer;
`;

const LogoutWrapper = styled.div`
  position: absolute;
  right: 10px;
`;

const Header = ({ auth }) => {
  const navigate = useNavigate();
  const { token, logout } = auth;

  const handleDashboard = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  }

  return (
    <HeaderWrapper className='shadow'>
      <HeaderButton onClick={handleDashboard}>BigBrain</HeaderButton>
      { token && <LogoutWrapper><Logout token={token} logout={logout}/></LogoutWrapper>}
    </HeaderWrapper>
  )
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default Header;
