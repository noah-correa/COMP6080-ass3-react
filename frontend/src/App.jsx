import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './utils/Router';
import { Context, initialValue } from './utils/Context';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SiteWrapper from './pages/SiteWrapper';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(initialValue.loggedIn);
  const [title, setTitle] = useState(initialValue.title);
  const [token, setToken] = useState(initialValue.token);
  const [sidebarOpen, setSidebarOpen] = useState(initialValue.sidebarOpen);

  const getters = {
    loggedIn,
    title,
    token,
    sidebarOpen,
  };

  const setters = {
    setLoggedIn,
    setTitle,
    setToken,
    setSidebarOpen,
  }

  return (
    <Context.Provider value={{ getters, setters }}>
      <BrowserRouter>
        <SiteWrapper>
          <Router/>
        </SiteWrapper>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
