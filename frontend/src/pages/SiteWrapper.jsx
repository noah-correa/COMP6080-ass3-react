import React from 'react';
import PropTypes from 'prop-types';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BodyWrapper, ContentWrapper } from '../styles/common';

const SiteWrapper = ({ children }) => {
  return (
    <>
      <Sidebar/>
      <Header/>
      <BodyWrapper>
        <ContentWrapper>
          { children }
        </ContentWrapper>
        <Footer/>
      </BodyWrapper>
    </>
  )
}

SiteWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SiteWrapper;
