import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = () => {
  const [error, setError] = React.useState(false);
  setTimeout(() => setError(true), 10000);
  return (
    <>
      { error
        ? (<Spinner animation='border'></Spinner>)
        : (<i>Sorry, please try again later.<br /><br /><small>If the problem persists, contact cs6080@cse.unsw.edu.au</small></i>)
      }
    </>
  );
}

export default Loading;
