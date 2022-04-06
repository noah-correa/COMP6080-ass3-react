import React, { useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { AuthCard, CardSubHeading } from '../../styles/common';
import ContentWrapper from '../../components/ContentWrapper';

const SessionJoin = () => {
  const sessionidRef = useRef('');
  const nameRef = useRef('');

  return (
    <ContentWrapper center>
      <AuthCard className='shadow'>
        <Card.Body>
          <CardSubHeading>Join Session</CardSubHeading>
          <Form>
            <Form.Group>
              <Form.Label>Session ID</Form.Label>
              <Form.Control required type='text' ref={sessionidRef}></Form.Control>
            </Form.Group><br/>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control required type='text' ref={nameRef}></Form.Control>
            </Form.Group><br/>
            <Button variant='primary'>Join</Button>
          </Form>
        </Card.Body>
      </AuthCard>
    </ContentWrapper>
  )
}

export default SessionJoin;
