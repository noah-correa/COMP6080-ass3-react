import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image, Modal, Badge, Stack } from 'react-bootstrap';
import API from '../utils/API';
import { useAuth } from '../utils/Auth';
import { Link, useNavigate } from 'react-router-dom';
import useQuizFetch from '../hooks/useQuizFetch';
import useAdminStatus from '../hooks/useAdminStatus';
import Loading from './Loading';
import CountdownTimer from './CountdownTimer';
import { BsQuestionCircle, BsStopwatch, BsCalendarWeek, BsPeople, BsCardList } from 'react-icons/bs';
import styled from 'styled-components';
import { formatDuration } from '../utils/utils';

const BadgeLink = styled(Link)`
  text-decoration: none;
  color: white;
  &:hover {
    color: lightgray;
  }
`;

const QuizCard = ({ empty, quizid, fetchAllQuizzes }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const { quiz, quizLoading, fetchQuiz } = useQuizFetch(token, quizid);
  const { adminStatus, fetchAdminStatus } = useAdminStatus(token, sessionId);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(0);
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [showStopPopup, setShowStopPopup] = useState(false);
  const [questionInProgress, setQuestionInProgress] = useState(false);
  const interval = useRef();

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

  // Set sessionid and timer to check number of players
  useEffect(() => {
    const intervalFetch = (token, sid) => fetchAdminStatus(token, sid);

    if (quiz.active) {
      setSessionId(quiz.active);
    }
    if (quiz.active && adminStatus.position === -1 && !quizStarted) {
      interval.current = setInterval(() => intervalFetch(token, quiz.active), 1000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [quiz, quizStarted, adminStatus]);

  // Fetch questions from backend
  useEffect(async () => {
    if (quizid) {
      setLoading(true);
      const data = await API.getQuiz(token, quizid);
      if (data.error) {
        console.error(data.error);
      } else {
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
    if (confirm(`Are you sure you want to delete ${quiz.name}?`)) {
      setLoading(true);
      const data = await API.deleteQuiz(token, quizid);
      setLoading(false);
      if (data.error) {
        console.log(data.error);
      } else {
        fetchAllQuizzes(token);
      }
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
        setQuizStarted(true);
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
      setQuizStarted(false);
      setShowStopPopup(true);
      setQuestionInProgress(false);
    }
    setLoading(false);
  }

  // View Results Button
  const handleViewResults = async (event) => {
    event.preventDefault();
    navigate(`/quiz/results/${sessionId}`);
  }

  // Create session url
  const generateSessionUrl = (sessionid) => {
    return window.location.href.replace('dashboard', `quiz/join/${sessionid}`);
  }

  const getCreatedDate = (date) => new Date(date).toLocaleDateString();
  const getCreatedTime = (date) => new Date(date).toLocaleTimeString();

  if (loading || quizLoading) return <Loading/>;

  return (
    <>
      <Card className='shadow' id={quizid} name={quiz.name}>
        <Card.Body>
          {/* Title / Active Row */}
          <div className='d-flex align-items-center justify-content-between mb-1'>
            <h4 className='mb-0'>{quiz.name}</h4>
              { quiz.active
                ? <Badge className='ms-auto' pill bg='success'><BadgeLink to={`/quiz/join/${quiz.active}`} target='_blank'>Active: {quiz.active}</BadgeLink></Badge>
                : <Badge className='ms-auto' pill bg='secondary'>{'Inactive'}</Badge>
              }
          </div>
          {/* Content Cell */}
          <div className='d-flex flex-column gap-2'>
            { quiz.active && adminStatus.position !== -1 &&
              <CountdownTimer
                timer={{
                  start: adminStatus.isoTimeLastQuestionStarted,
                  duration: adminStatus.questions[adminStatus.position].duration
                }}
                onEnd={() => setQuestionInProgress(false)}
              />
            }
            <div className='d-flex justify-content-between'>
              {/* Left Column */}
              <Stack gap={2} className=''>
                <div><BsCalendarWeek/> <span><span>{getCreatedDate(quiz.createdAt)}</span>, <span className='text-nowrap'>{getCreatedTime(quiz.createdAt)}</span></span></div>
                <div><BsQuestionCircle/> { questions.length } question{ questions.length === 1 ? '' : 's' }</div>
                <div><BsStopwatch/> {formatDuration(duration)}</div>
                { quiz.thumbnail &&
                  <div className='w-75'>
                    <Image fluid thumbnail src={quiz.thumbnail} alt='No image' width='100%' height='100%'/>
                  </div>
                }
              </Stack>
              {/* Right Column */}
              <div className='d-flex align-items-center justify-content-between p-3 bg-light border border-2 border-secondary rounded'>
                {/* Active Game Column */}
                { quiz.active &&
                  <Stack gap={2} className='d-flex align-items-start justify-content-center me-4'>
                    <div><BsPeople/> {adminStatus.players.length}</div>
                    <div><BsCardList/> {adminStatus.position === -1 ? 'Lobby' : `Question ${adminStatus.position + 1} of ${adminStatus.questions.length}`}</div>
                  </Stack>
                }
                {/* Buttons Column */}
                <div className='d-flex align-items-end justify-content-center'>
                  <Stack gap={2}>
                    { !quiz.active && <Button variant='primary' onClick={handleEdit} name='edit'>Edit</Button> }
                    { !quiz.active && <Button variant='danger' onClick={handleDelete} name='delete'>Delete</Button> }
                    { !quiz.active && <Button variant='success' onClick={handleStart} name='start'>Start</Button> }
                    { quiz.active && <Button variant='warning' onClick={handleAdvance} name='advance' disabled={questionInProgress || !adminStatus.players.length}>Next</Button> }
                    { quiz.active && <Button variant='danger' onClick={handleStop} name='stop'>Stop</Button> }
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Modal show={showStartPopup} onHide={() => setShowStartPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>New Session Started</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Open session in new tab: <Link to={`/quiz/join/${quiz.active}`} target='_blank'>{quiz.active || ''}</Link></p>
            <div className='d-flex justify-content-end'>
              { quiz.active && <Button variant='primary' onClick={() => navigator.clipboard.writeText(generateSessionUrl(quiz.active))}>Copy Session Link</Button> }
            </div>
          </Modal.Body>
      </Modal>
      <Modal show={showStopPopup} onHide={() => setShowStopPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Session Ended</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Would you like to view the results?</p>
            <div className='d-flex justify-content-end'>
              <Button variant='primary' onClick={handleViewResults} name='show-results'>Yes</Button>
              <Button variant='danger' onClick={() => setShowStopPopup(false)} name='close-results'>No</Button>
            </div>
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
