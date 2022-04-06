import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Card, Image, Modal } from 'react-bootstrap';
import API from '../utils/API';
import { useAuth } from '../utils/Auth';
import { Link, useNavigate } from 'react-router-dom';
import useQuizFetch from '../hooks/useQuizFetch';
import Loading from './Loading';

const QuizCard = ({ empty, quizid }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { quiz, quizLoading, fetchQuiz } = useQuizFetch(token, quizid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(0);
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [showStopPopup, setShowStopPopup] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Empty Quiz Card
  if (empty) {
    return (
      <Card className='shadow'>
        <Card.Body className='text-center'>
          <i>No quizzes to display</i>
        </Card.Body>
      </Card>
    );
  }

  // Fetch questions from backend
  useEffect(async () => {
    if (quizid) {
      setLoading(true);
      const data = await API.getQuiz(token, quizid);
      if (data.error) {
        console.error(data.error);
        setError('Could not fetch quiz');
      } else {
        setError('');
        setQuestions(data.questions);
      }
      setLoading(false);
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
  const handleEdit = (event) => {
    event.preventDefault();
    navigate(`/quiz/edit/${quizid}`);
  }

  // Delete Button Handler
  const handleDelete = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = await API.deleteQuiz(token, quizid);
    if (data.error) {
      setError('Could not delete quiz');
    } else {
      fetchQuiz(token, quizid);
    }
    setLoading(false);
  }

  // Start game handler
  const handleStart = async (event, quizid) => {
    event.preventDefault();
    setLoading(true);
    const data = await API.startGame(token, quizid);
    if (data.error) {
      console.error(data.error);
    } else {
      fetchQuiz(token, quizid);
      setShowStartPopup(true);
    }
    setLoading(false);
  }

  // Stop game handler
  const handleStop = async (event, quizid) => {
    event.preventDefault();
    setLoading(true);
    setSessionId(quiz.active);
    const data = await API.endGame(token, quizid);
    if (data.error) {
      console.error(data.error);
    } else {
      fetchQuiz(token, quizid);
      setShowStopPopup(true);
    }
    setLoading(false);
  }

  // Create session url
  const generateSessionUrl = (sessionid) => {
    return window.location.href.replace('dashboard', `quiz/play/${sessionid}`);
  }

  const handleViewResults = async (event) => {
    event.preventDefault();
    navigate(`/quiz/play/${sessionId}/results`, { state: { sessionid: sessionId } });
  }

  if (loading || quizLoading) return <Loading/>;

  return (
    <>
      <Card className='shadow'>
        <Card.Body>
          { error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert> }
          <h4>{quiz.name}</h4>
          <p>Id: {quizid}</p>
          <p>Created: {quiz.createdAt}</p>
          <Image thumbnail src={quiz.thumbnail} alt='No image' width='100px' height='100px'/>
          <p>Owner: {quiz.owner}</p>
          <p>Total Duration: {duration} seconds</p>
          <p>{ questions.length } question{ questions.length === 1 ? '' : 's' }</p>
          { quiz.active && <p>Active Room: <Link to={`/quiz/play/${quiz.active}`} target='_blank'>{quiz.active}</Link></p> }
          <Button variant='primary' onClick={handleEdit}>Edit</Button>
          <Button variant='danger' onClick={handleDelete}>Delete</Button>
          { quiz.active
            ? <Button variant='warning' onClick={(e) => handleStop(e, quizid)}>Stop</Button>
            : <Button variant='success' onClick={(e) => handleStart(e, quizid)}>Start</Button>
          }
        </Card.Body>
      </Card>
      <Modal show={showStartPopup} onHide={() => setShowStartPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>New Session Started</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Open session in new tab: <Link to={`/quiz/play/${quiz.active}`} target='_blank'>{quiz.active || ''}</Link></p>
            { quiz.active && <Button variant='primary' onClick={() => navigator.clipboard.writeText(generateSessionUrl(quiz.active))}>Copy Session Link</Button> }
          </Modal.Body>
      </Modal>
      <Modal show={showStopPopup} onHide={() => setShowStopPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Session Ended</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Would you like to view the results?</p>
            <Button variant='primary' onClick={handleViewResults}>Yes</Button>
            <Button variant='danger' onClick={() => setShowStopPopup(false)}>No</Button>
          </Modal.Body>
      </Modal>
    </>
  )
}

QuizCard.propTypes = {
  empty: PropTypes.bool,
  quizid: PropTypes.number,
}

export default QuizCard;
