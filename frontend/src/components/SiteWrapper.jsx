import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';
import { useAuth } from '../utils/Auth';

const BodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #46178f;
    min-height: calc(100vh - 100px);
`;

const SiteWrapper = ({ children }) => {
  const auth = useAuth();
  return (
    <>
      <Header auth={auth}/>
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
