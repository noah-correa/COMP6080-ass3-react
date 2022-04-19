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
  padding-left: 10px;
`;

const HeaderTitleButton = styled.h2`
  cursor: pointer;
`;

const HeaderNavButton = styled.div`
  cursor: pointer;
  border-radius: 5px;
  padding: 4px 6px;
  &:hover {
    /* color: lightgrey; */
    background-color: #46178f;
  }
`;

const LogoutWrapper = styled.div`
  position: absolute;
  right: 5px;
`;

const Header = ({ auth }) => {
  const navigate = useNavigate();
  const { token, logout } = auth;

  const handleDashboard = (event) => {
    event.preventDefault();
    if (!token) navigate('/login');
    navigate('/dashboard');
  }

  const handleJoinGame = (event) => {
    event.preventDefault();
    navigate('/quiz/join');
  }

  return (
    <HeaderWrapper className='shadow'>
      <div className='d-flex align-items-center'>
        <HeaderTitleButton onClick={handleDashboard}>BigBrain</HeaderTitleButton>
        <div className='ms-3'>
          <HeaderNavButton onClick={handleJoinGame}>Join Game</HeaderNavButton>
        </div>
      </div>
      { token && <LogoutWrapper><Logout token={token} logout={logout}/></LogoutWrapper>}
    </HeaderWrapper>
  )
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default Header;
