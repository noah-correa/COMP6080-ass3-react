import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Container, Image } from 'react-bootstrap';
// import API from '../utils/API';
// import { useAuth } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

const QuestionCard = ({ quiz, question }) => {
  // const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // View Button Handler
  const handleEdit = async (event) => {
    event.preventDefault();
    navigate(`/quiz/edit/${question.quizid}/${question.questionid}`, { state: { quiz: quiz } })
  }

  // Delete Button Handler
  const handleDelete = async (event) => {
    event.preventDefault();
  }

  return (
    // <Card className='shadow-sm mb-2'>
    //   <Card.Body>
    <Container>
      { error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert> }
      {/* <p>Id: {question.id}</p> */}
      <p>Question: {question.question}</p>
      <p>Type: {question.type}</p>
      { question.media.type === 'file' && <Image thumbnail src={question.media.content} alt='No image' width='100px' height='100px'/> }
      <p>Points: {question.points}</p>
      <p>Duration: {question.duration} seconds</p>
      <Button variant='primary' onClick={handleEdit}>Edit</Button>
      <Button variant='danger' onClick={handleDelete}>Delete</Button>
    </Container>
    //   </Card.Body>
    // </Card>
  )
}

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  quiz: PropTypes.object.isRequired,
}

export default QuestionCard;
