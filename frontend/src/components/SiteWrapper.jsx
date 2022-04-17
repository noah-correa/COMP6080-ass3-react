import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import { BodyWrapper } from '../styles/common';

const SiteWrapper = ({ children }) => {
  return (
    <>
      <Header/>
      <BodyWrapper>
        { children }
      </BodyWrapper>
      <Footer/>
    </>
  )
}

SiteWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default SiteWrapper;
