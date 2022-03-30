import React, { useRef, useState } from 'react';
import useAppContext from '../utils/Context';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../utils/API';

import Loading from '../components/Loading';

import { Main, AuthCard, CardHeading, CardSubHeading } from '../styles';

const Login = (props) => {
  const { setters } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const emailRef = useRef('');
  const passwordRef = useRef('');

  if (loading) return <Loading/>;

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const data = await API.login(emailRef.current.value, passwordRef.current.value);
    if (data.error) {
      setError(data.error);
    } else {
      setters.setToken(data.token);
    }
    setLoading(false);
  };

  return (
    <Main>
      <AuthCard>
        <Card.Body>
          <CardHeading>BigBrain</CardHeading>
          <br/>
          <CardSubHeading>Login</CardSubHeading>
          <Form>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' placeholder='Enter email' autoComplete='on' ref={emailRef}></Form.Control>
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Enter password' autoComplete='on' ref={passwordRef}></Form.Control>
            </Form.Group>
            <br/>
            <Button variant='primary' type='button' onClick={handleLogin}>Login</Button>
          </Form>
          <br/>
          <Link to="/register">Don&apos;t have an account? Register</Link>
        </Card.Body>
      </AuthCard>
      { error && <Alert>{error}</Alert> }
    </Main>
  );
}

export default Login;
