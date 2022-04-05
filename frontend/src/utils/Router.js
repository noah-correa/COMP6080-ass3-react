import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Page Components
import PrivateRoute from '../components/PrivateRoute';
// import PrivateOutlet from '../components/PrivateOutlet';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import QuizEdit from '../pages/Quiz/QuizEdit';
import QuizQuestion from '../pages/Quiz/QuizQuestion';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to={'/dashboard'}/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      <Route path='/quiz/edit' element={<Outlet/>}>
        <Route path=':quizid' element={<QuizEdit/>}/>
        <Route path=':quizid/:questionid' element={<QuizQuestion/>}/>
      </Route>
    </Routes>
  );
}

export default Router;
