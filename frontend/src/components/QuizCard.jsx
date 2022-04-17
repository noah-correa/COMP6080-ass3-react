import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Card, Image, Modal } from 'react-bootstrap';
import API from '../utils/API';
import { useAuth } from '../utils/Auth';
import { Link, useNavigate } from 'react-router-dom';
import useQuizFetch from '../hooks/useQuizFetch';
import useAdminStatus from '../hooks/useAdminStatus';
import Loading from './Loading';
import CountdownTimer from './CountdownTimer';

const QuizCard = ({ empty, quizid, fetchAllQuizzes }) => {
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
  const { adminStatus, fetchAdminStatus } = useAdminStatus(token, sessionId);
  const [questionInProgress, setQuestionInProgress] = useState(false);

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

  // Set sessionid
  useEffect(() => {
    if (quiz) setSessionId(quiz.active);
  }, [quiz]);

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
      setDuration(questions.reduce((sum, question) => sum + question.duration, 0));
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
    setLoading(false);
    if (data.error) {
      setError('Could not delete quiz');
      console.log(data.error);
    } else {
      fetchAllQuizzes(token);
    }
  }

  // Start game handler
  const handleStart = async (event) => {
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

  // Advance game handler
  const handleAdvance = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (adminStatus.position === adminStatus.questions.length - 1) {
      await handleStop(event);
    } else {
      const data = await API.advanceGame(token, quizid);
      if (data.error) {
        console.error(data.error);
      } else {
        fetchQuiz(token, quizid);
        fetchAdminStatus(token, sessionId);
        setQuestionInProgress(true);
      }
      setLoading(false);
    }
  }

  // Stop game handler
  const handleStop = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = await API.endGame(token, quizid);
    if (data.error) {
      console.error(data.error);
    } else {
      fetchQuiz(token, quizid);
      setShowStopPopup(true);
      setQuestionInProgress(false);
    }
    setLoading(false);
  }

  // View Results Button
  const handleViewResults = async (event) => {
    event.preventDefault();
    navigate(`/quiz/play/${sessionId}/results`, { state: { sessionid: sessionId } });
  }

  // Create session url
  const generateSessionUrl = (sessionid) => {
    return window.location.href.replace('dashboard', `quiz/join/${sessionid}`);
  }

  if (loading || quizLoading) return <Loading/>;

  return (
    <>
      <Card className='shadow'>
        <Card.Body>
          { error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert> }
          <h4>{quiz.name}</h4>
          <p>Id: {quizid}</p>
          <p>Created: {new Date(quiz.createdAt).toLocaleString()}</p>
          <Image thumbnail src={quiz.thumbnail} alt='No image' width='100px' height='100px'/>
          <p>Owner: {quiz.owner}</p>
          <p>Total Duration: {duration} seconds</p>
          <p>{ questions.length } question{ questions.length === 1 ? '' : 's' }</p>
          { quiz.active && <p>Active Room: <Link to={`/quiz/join/${quiz.active}`} target='_blank'>{quiz.active}</Link></p> }
          { quiz.active && <p>{adminStatus.players.length} player{adminStatus.players.length === 1 ? '' : 's'}</p> }
          { quiz.active && <p>Current Status: {adminStatus.position === -1 ? 'Lobby' : `Question ${adminStatus.position + 1} of ${adminStatus.questions.length}`}</p> }
          { quiz.active && adminStatus.position !== -1 &&
            <CountdownTimer
              // start={adminStatus.isoTimeLastQuestionStarted}
              // duration={adminStatus.questions[adminStatus.position].duration}
              timer={{
                start: adminStatus.isoTimeLastQuestionStarted,
                duration: adminStatus.questions[adminStatus.position].duration
              }}
              onEnd={() => setQuestionInProgress(false)}
            />
          }
          { !quiz.active && <Button variant='success' onClick={handleStart}>Start</Button> }
          { quiz.active &&
            <>
              <Button variant='warning' onClick={handleAdvance} disabled={questionInProgress}>Advance</Button>
              <Button variant='danger' onClick={handleStop}>Stop</Button>
            </>
          }
          { !quiz.active &&
            <>
              <br/>
              <Button variant='primary' onClick={handleEdit}>Edit</Button>
              <Button variant='danger' onClick={handleDelete}>Delete</Button>
            </>
          }
        </Card.Body>
      </Card>
      <Modal show={showStartPopup} onHide={() => setShowStartPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>New Session Started</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Open session in new tab: <Link to={`/quiz/join/${quiz.active}`} target='_blank'>{quiz.active || ''}</Link></p>
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
  fetchAllQuizzes: PropTypes.func,
}

export default QuizCard;
