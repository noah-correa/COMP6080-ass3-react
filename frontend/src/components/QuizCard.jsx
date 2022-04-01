import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Card, Image } from 'react-bootstrap';
import API from '../utils/API';
import useAppContext from '../utils/Context';

const QuizCard = ({ empty, quiz, fetchQuizzes }) => {
  const { getters } = useAppContext();
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(0);

  // Empty Quiz Card
  if (empty) {
    return (
      <Card className='shadow-sm mb-2'>
        <Card.Body>
          <p className='text-center'><i>No quizzes to display</i></p>
        </Card.Body>
      </Card>
    );
  }

  // Fetch questions from backend
  useEffect(async () => {
    if (quiz.id) {
      const data = await API.getQuiz(getters.token, quiz.id);
      if (data.error) {
        console.error(data.error);
        setError('Could not fetch quiz');
      } else {
        setError('');
        setQuestions(data.questions);
      }
    }
  }, []);

  // Calculate questions duration
  useEffect(() => {
    if (questions) {
      let time = 0;
      questions.forEach((question) => {
        time += question.duration;
      });
      setDuration(time);
    }
  }, [questions]);

  // View Button Handler
  const handleView = async (event) => {
    event.preventDefault();
  }

  // Delete Button Handler
  const handleDelete = async (event) => {
    event.preventDefault();
    const data = await API.deleteQuiz(getters.token, quiz.id);
    if (data.error) {
      setError('Could not delete quiz');
    } else {
      fetchQuizzes(getters.token);
    }
  }

  return (
    <Card className='shadow-sm mb-2'>
      <Card.Body>
        { error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert> }
        <p>Id: {quiz.id}</p>
        <p>Created: {quiz.createdAt}</p>
        <p>Name: {quiz.name}</p>
        <Image thumbnail src={quiz.thumbnail} alt='No image' width='50px' height='50px'/>
        <p>Owner: {quiz.owner}</p>
        <p>Duration: {duration} seconds</p>
        <p>{ questions.length } question{ questions.length === 1 ? '' : 's' }</p>
        <Button variant='primary' onClick={handleView}>View</Button>
        <Button variant='danger' onClick={handleDelete}>Delete</Button>
      </Card.Body>
    </Card>
  )
}

QuizCard.propTypes = {
  empty: PropTypes.bool,
  quiz: PropTypes.object,
  fetchQuizzes: PropTypes.func,
}

export default QuizCard;
