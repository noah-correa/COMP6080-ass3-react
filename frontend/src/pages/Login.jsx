import React, { useRef, useState } from 'react';
import useAppContext from '../utils/Context';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/API';

// Components
import Loading from '../components/Loading';

// Styled Components
import { Main, AuthCard, CardSubHeading } from '../styles/common';

const Login = () => {
  const { setters } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Form States
  const emailRef = useRef('');
  const passwordRef = useRef('');

  // Login Submit Button Handler
  const handleLogin = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      if (!form.email.value) setErrors(prev => { return { ...prev, email: true } });
      if (!form.password.value) setErrors(prev => { return { ...prev, password: true } });
    } else {
      setLoading(true);
      const data = await API.login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      if (data.error) {
        console.error('Could not login user');
        setLoginError('Invalid email or password');
        setValidated(false);
      } else {
        setValidated(true);
        setErrors({});
        localStorage.setItem('bb_token', data.token);
        setters.setToken(data.token);
        setters.setLoggedIn(true);
        navigate('/dashboard');
      }
    }
  };

  if (loading) return <Loading/>;

  return (
    <Main>
      <AuthCard>
        <Card.Body>
          <CardSubHeading>Login</CardSubHeading>
          { loginError && <Alert variant='danger' dismissible onClose={() => setLoginError('')}>{loginError}</Alert>}
          <Form noValidate validated={validated} onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control required isInvalid={!!errors.email} type='email' placeholder='Enter email' autoComplete='on' ref={emailRef} name="email"></Form.Control>
              <Form.Control.Feedback type='invalid'>Invalid email</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control required isInvalid={!!errors.password} type='password' placeholder='Enter password' autoComplete='on' ref={passwordRef} name="password"></Form.Control>
              <Form.Control.Feedback type='invalid'>Invalid password</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Button variant='primary' type='submit'>Login</Button>
          </Form>
          <br/>
          <Link to="/register">Don&apos;t have an account? Register</Link>
        </Card.Body>
      </AuthCard>
    </Main>
  );
}

export default Login;
