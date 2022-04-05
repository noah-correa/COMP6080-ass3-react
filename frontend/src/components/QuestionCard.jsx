import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Image, Ratio } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const QuestionCard = ({ quiz, question, updateQuiz }) => {
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
    const body = { ...quiz };
    const questions = [...body.questions];
    const found = questions.indexOf(question);
    questions.splice(found, 1);
    body.questions = questions;
    updateQuiz(body);
  }

  return (
    <>
      { error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert> }
      <h5>Question {quiz.questions.indexOf(question) + 1}: </h5><p>{question.question}</p>
      <p>Type: {question.type}</p>
      { !question.media.content && <p>No media attached</p>}
      { question.media.type === 'file' && question.media.content && <Image thumbnail src={question.media.content} alt='No image' width='100px' height='100px'/> }
      { question.media.type === 'url' && question.media.content &&
                  <Ratio aspectRatio='16x9'>
                    <iframe
                      title='Question Media'
                      src={question.media.content}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </Ratio>
                }
      <p>Points: {question.points}</p>
      <p>Duration: {question.duration} seconds</p>
      <Button variant='primary' onClick={handleEdit}>Edit</Button>
      <Button variant='danger' onClick={handleDelete}>Delete</Button>
    </>
  )
}

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  quiz: PropTypes.object.isRequired,
  updateQuiz: PropTypes.func.isRequired,
}

export default QuestionCard;
