import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../utils/Auth';

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

const Header = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleDashboard = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  }

  return (
    <HeaderWrapper className='shadow'>
      <HeaderButton onClick={handleDashboard}>BigBrain</HeaderButton>
      { token && <LogoutWrapper><Logout/></LogoutWrapper>}
    </HeaderWrapper>
  )
}

export default Header;
