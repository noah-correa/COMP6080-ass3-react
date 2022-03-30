import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Context, initialValue } from './utils/Context';
import 'bootstrap/dist/css/bootstrap.min.css';

import Router from './utils/Router';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import { BodyWrapper, ContentWrapper } from './styles';

function App () {
  const [content, setContent] = useState(initialValue.content);
  const [loaded, setLoaded] = useState(initialValue.loaded);
  const [loggedIn, setLoggedIn] = useState(initialValue.loggedIn);
  const [title, setTitle] = useState(initialValue.title);
  const [token, setToken] = useState(initialValue.token);

  const getters = {
    content,
    loaded,
    loggedIn,
    title,
    token
  };

  const setters = {
    setContent,
    setLoaded,
    setLoggedIn,
    setTitle,
    setToken,
  }

  return (
    <Context.Provider value={{ getters, setters }}>
      <BrowserRouter>
        { loggedIn && <Sidebar/>}
        <BodyWrapper>
          <ContentWrapper>
            <Router/>
          </ContentWrapper>
          <Footer/>
        </BodyWrapper>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
