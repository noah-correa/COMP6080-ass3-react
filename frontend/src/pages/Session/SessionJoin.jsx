import React, { useEffect, useRef, useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/API';
import { useAuth } from '../../utils/Auth';
import { AuthCard, CardSubHeading } from '../../styles/common';
import ContentWrapper from '../../components/ContentWrapper';

const SessionJoin = () => {
  const { setTitle } = useAuth();
  const { sessionid } = useParams();
  const navigate = useNavigate();
  const sessionidRef = useRef('');
  const nameRef = useRef('');
  const [error, setError] = useState('');

  // Update App Title
  useEffect(() => {
    setTitle('Join Session');
  }, []);

  // Populate sessionid field if defined
  useEffect(() => {
    if (sessionid) sessionidRef.current.value = sessionid;
  }, [sessionid]);

  // Join Button Handler
  const handleJoin = async (event) => {
    event.preventDefault();
    const sessionid = parseInt(sessionidRef.current.value, 10);
    const data = await API.playerJoin(sessionid, nameRef.current.value);
    if (!data.error) {
      navigate(`/quiz/play/${sessionid}`, { state: { playerid: data.playerId } });
    } else {
      console.error(data.error);
      setError(data.error);
    }
  }

  return (
    <ContentWrapper center>
      <AuthCard className='shadow'>
        <Card.Body>
          <CardSubHeading>Join Session</CardSubHeading>
          { error && <Alert dismissible variant='danger' onClose={() => setError('')}>{error}</Alert> }
          <Form>
            <Form.Group>
              <Form.Label>Session ID</Form.Label>
              <Form.Control required type='text' ref={sessionidRef}></Form.Control>
            </Form.Group><br/>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control required type='text' ref={nameRef}></Form.Control>
            </Form.Group><br/>
            <Button variant='primary' onClick={handleJoin}>Join</Button>
          </Form>
        </Card.Body>
      </AuthCard>
    </ContentWrapper>
  )
}

export default SessionJoin;
