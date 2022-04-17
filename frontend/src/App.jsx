import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './utils/Router';
import SiteWrapper from './components/SiteWrapper';
import { ProvideAuth } from './utils/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <SiteWrapper>
          <Router/>
        </SiteWrapper>
      </BrowserRouter>
    </ProvideAuth>
  );
}

export default App;
