import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Page Components
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to={'/dashboard'}/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dashboard' element={<Dashboard/>}>
        {/* Dashboard Content */}
      </Route>
    </Routes>
  );
}

export default Router;
