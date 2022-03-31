import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.i`
  color: lightgrey;
`;

const Loading = () => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(true);
      console.error('An error occured loading content');
    }, 10000);
    return () => {
      clearTimeout(timeout);
    }
  }, []);

  return (
    <LoadingWrapper>
      { error
        ? <Info>Something went wrong, please try again later.</Info>
        : <Spinner animation='border' variant="light"></Spinner>
      }
    </LoadingWrapper>
  );
}

export default Loading;
