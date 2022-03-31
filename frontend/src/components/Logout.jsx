import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAppContext from '../utils/Context';
import API from '../utils/API';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const LogoutButtonWrapper = styled(Button)`
  color: white;
  background-color: #25076b;
  border: none;
  &:hover, &:focus {
    background-color: #46178f;
  };
`;

const Logout = () => {
  const { getters, setters } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault();
    const data = await API.logout(getters.token);
    if (data.error) {
      console.error('Invalid token');
    } else {
      setters.setToken('');
      setters.setLoggedIn(false);
      navigate('/login');
    }
  }

  return (
    <LogoutButtonWrapper variant='secondary' onClick={handleLogout}>
      <i className="bi bi-box-arrow-right"></i> Logout
    </LogoutButtonWrapper>
  )
}

export default Logout;
