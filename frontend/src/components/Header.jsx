import React from 'react';
import useAppContext from '../utils/Context';
import styled from 'styled-components';

import Logout from './Logout';

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
  const { getters, setters } = useAppContext();

  const handleSidebarToggle = async (event) => {
    event.preventDefault();
    setters.setSidebarOpen(!getters.sidebarOpen);
  }

  return (
    <HeaderWrapper className='shadow'>
      <IconButton
        style={getters.loggedIn ? visible : hidden }
        onClick={handleSidebarToggle}>
          <h3><i className="bi bi-list"></i></h3>
      </IconButton>
      <h2>BigBrain</h2>
      { getters.loggedIn && <LogoutWrapper><Logout/></LogoutWrapper>}
    </HeaderWrapper>
  )
}

export default Header;
