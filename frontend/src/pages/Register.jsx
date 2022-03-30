import React, { useRef, useState } from 'react';
import useAppContext from '../utils/Context';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../utils/API';

import Loading from '../components/Loading';

import { Main, AuthCard, CardHeading, CardSubHeading } from '../styles';

const Register = (props) => {
  const { setters } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const cpasswordRef = useRef('');
  const nameRef = useRef('');

  if (loading) return <Loading/>;

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const data = await API.register(emailRef.current.value, passwordRef.current.value, nameRef.current.value);
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
          <CardSubHeading>Register</CardSubHeading>
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
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' placeholder='Confirm password' autoComplete='on' ref={cpasswordRef}></Form.Control>
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' placeholder='Enter name' autoComplete='on' ref={nameRef}></Form.Control>
            </Form.Group>
            <br/>
            <Button variant='primary' type='button' onClick={handleRegister}>Register</Button>
          </Form>
          <br/>
          <Link to="/login">Already have an account? Login</Link>
        </Card.Body>
      </AuthCard>
      { error && <Alert>{error}</Alert> }
    </Main>
  );
}

export default Register;
