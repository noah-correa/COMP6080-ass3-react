import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAppContext from './Context';

// import Site from './pages/Site';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
// import LogoutAction from './components/LogoutAction';

const Router = () => {
  const { getters } = useAppContext();

  return (
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      {/* <Route path="/logout" element={<LogoutAction />} /> */}
      <Route path='/dashboard' element={getters.isLoggedIn ? <Dashboard/> : <Navigate to={'/login'}/>}>
      </Route>
      <Route path="*" element={<Navigate to={getters.loggedIn ? '/dashboard' : '/login'}/>} />
    </Routes>
  );
}

export default Router;
