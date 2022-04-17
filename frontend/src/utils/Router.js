import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Page Components
import PrivateRoute from '../components/PrivateRoute';
import PrivateOutlet from '../components/PrivateOutlet';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import QuizEdit from '../pages/Quiz/QuizEdit';
import QuizQuestionEdit from '../pages/Quiz/QuizQuestionEdit';
import SessionPlay from '../pages/Session/SessionPlay';
import SessionResults from '../pages/Session/SessionResults';
import SessionJoin from '../pages/Session/SessionJoin';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to={'/dashboard'}/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      <Route path='/quiz' element={<Outlet/>}>
        <Route path='edit' element={<PrivateOutlet/>}>
          <Route path=':quizid' element={<QuizEdit/>}/>
          <Route path=':quizid/:questionid' element={<QuizQuestionEdit/>}/>
        </Route>
        <Route path='join' element={<Outlet/>}>
          <Route index path='' element={<SessionJoin/>}/>
          <Route path=':sessionid' element={<SessionJoin/>}/>
        </Route>
        <Route path='play' element={<Outlet/>}>
          <Route path=':sessionid' element={<SessionPlay/>}/>
          <Route path=':sessionid/results' element={<PrivateRoute><SessionResults/></PrivateRoute>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
