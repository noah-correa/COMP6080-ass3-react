import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../utils/Auth';

import Logout from './Logout';
import { useNavigate } from 'react-router-dom';

const HeaderWrapper = styled.header`
  background-color: #25076b;
  z-index: 5;
  /* border-radius: 2px; */
  /* box-shadow: 0px 1px 10px black; */
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  position: sticky;
  top: 0;
  color: white;
`;

const HeaderButton = styled.h2`
  cursor: pointer;
`;

const IconButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
`;

const LogoutWrapper = styled.div`
  position: absolute;
  right: 10px;
`;

const hidden = {
  visibility: 'hidden'
};

const visible = {
  visibility: 'visible'
};

const Header = () => {
  const { token, sidebarOpen, setSidebarOpen } = useAuth();
  const navigate = useNavigate();

  const handleSidebarToggle = async (event) => {
    event.preventDefault();
    setSidebarOpen(!sidebarOpen);
  }

  const handleDashboard = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  }

  return (
    <HeaderWrapper className='shadow'>
      <IconButton
        style={ token ? visible : hidden }
        onClick={handleSidebarToggle}>
          <h3><i className="bi bi-list"></i></h3>
      </IconButton>
      <HeaderButton onClick={handleDashboard}>BigBrain</HeaderButton>
      { token && <LogoutWrapper><Logout/></LogoutWrapper>}
    </HeaderWrapper>
  )
}

export default Header;
