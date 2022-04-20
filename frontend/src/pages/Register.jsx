import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../utils/Auth';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { AuthCard, CardSubHeading } from '../styles/common';
import ContentWrapper from '../components/ContentWrapper';

const Register = () => {
  const { register, token, setTitle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('')
  const [validated, setValidated] = useState(false);

  // Form States
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const cpasswordRef = useRef('');
  const nameRef = useRef('');

  // Check if logged in already
  useEffect(() => {
    setTitle('BigBrain');
    if (token) navigate('/dashboard');
  }, []);

  // Register Submit Button Handler
  const handleRegister = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      if (!form.email.value) setErrors(prev => { return { ...prev, email: true } });
      if (!form.password.value) setErrors(prev => { return { ...prev, password: true } });
      if (!form.cpassword.value) setErrors(prev => { return { ...prev, cpassword: true } });
      if (!form.name.value) setErrors(prev => { return { ...prev, name: true } });
    } else if (passwordRef.current.value !== cpasswordRef.current.value) {
      setErrors(prev => { return { ...prev, passwords: true } });
    } else {
      setLoading(true);
      const data = await register(emailRef.current.value, passwordRef.current.value, nameRef.current.value);
      setLoading(false);
      if (data.error) {
        console.error('Could not register user');
        setRegisterError('Email taken');
        setValidated(false);
      } else {
        setValidated(true);
        setRegisterError('');
        setErrors({});
        navigate('/dashboard');
      }
    }
  };

  if (loading) return <Loading/>;

  return (
    <ContentWrapper center>
      <AuthCard className='shadow'>
        <Card.Body>
          <CardSubHeading>Register</CardSubHeading>
          { registerError && <Alert variant='danger' dismissible onClose={() => setRegisterError('')}>{registerError}</Alert>}
          <Form noValidate onSubmit={handleRegister} validated={validated}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control required id='email' isInvalid={!!errors.email} type='email' placeholder='Enter email' autoComplete='on' ref={emailRef} name='email'></Form.Control>
              <Form.Control.Feedback type='invalid'>Invalid name</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control required id='password' isInvalid={!!errors.password} type='password' placeholder='Enter password' ref={passwordRef} name='password'></Form.Control>
              <Form.Control.Feedback type='invalid'>Invalid password</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control required id='password-confirm' isInvalid={!!errors.cpassword || !!errors.passwords} type='password' placeholder='Confirm password' ref={cpasswordRef} name='cpassword'></Form.Control>
              <Form.Control.Feedback type='invalid'>Passwords must match</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control required id='name' isInvalid={!!errors.name} type='text' placeholder='Enter name' autoComplete='on' ref={nameRef} name='name'></Form.Control>
              <Form.Control.Feedback type='invalid'>Invalid name</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Button id='register-button' variant='primary' type='submit'>Register</Button>
          </Form>
          <br/>
          <Link id='login-link' to="/login">Already have an account? Login</Link>
        </Card.Body>
      </AuthCard>
    </ContentWrapper>
  );
}

export default Register;
