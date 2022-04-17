import React from 'react';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = (variant) => {
  return (
    <LoadingWrapper>
      <Spinner animation='border' variant={variant || 'light'}></Spinner>
    </LoadingWrapper>
  );
}

Loading.propTypes = {
  variant: PropTypes.string,
}

export default Loading;
