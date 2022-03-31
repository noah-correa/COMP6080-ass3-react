import React, { useEffect } from 'react';
import useAppContext from '../utils/Context';
import { Outlet, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { getters } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getters.loggedIn) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <div>Dashboard</div>
      { getters.loggedIn
        ? <p>Logged In</p>
        : <p>Not Logged In</p>}
      <Outlet/>
    </>

  )
}

export default Dashboard;
