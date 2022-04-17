import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/ContentWrapper';
import { Card, Spinner } from 'react-bootstrap';
import { AuthCard } from '../../styles/common';
import PlayQuestionCard from '../../components/PlayQuestionCard';
import API from '../../utils/API';

const SessionPlay = () => {
  const { sessionid } = useParams();
  const { state } = useLocation();
  const playerid = state && state.playerid;
  const navigate = useNavigate();
  const [playerStatus, setPlayerStatus] = useState(false);
  const [playerQuestion, setPlayerQuestion] = useState({});
  const [questionEnd, setQuestionEnd] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState('');
  const [quizEnd, setQuizEnd] = useState(false);

  // Check if player is logged in
  useEffect(() => {
    if (!state || !state.playerid) {
      navigate(`/quiz/join/${sessionid}`);
    }
  }, [state]);

  // Fetch Player Status
  const fetchPlayerStatus = async (pid) => {
    const id = parseInt(pid, 10);
    try {
      const data = await API.playerStatus(id);
      if (!data.error) {
        setPlayerStatus(data.started);
        return data.started;
      } else return false;
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch Player Question
  const fetchPlayerQuestion = async (pid) => {
    const id = parseInt(pid, 10);
    try {
      const data = await API.getPlayerQuestion(id);
      if (!data.error) {
        // If question is new or undefined
        // console.log(data.question.isoTimeLastQuestionStarted);
        // console.log(questionStartTime);
        if (data.question.isoTimeLastQuestionStarted !== questionStartTime) {
          setPlayerQuestion(data.question);
          setQuestionEnd(false);
          setQuestionStartTime(data.question.isoTimeLastQuestionStarted);
          return true;
        }
        return false;
      } else {
        // console.error(data.error);
        // Session inactive
        setQuizEnd(true);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // On initial mount - Check if session started every second
  useEffect(async () => {
    const timer = setInterval(async () => {
      const data = await fetchPlayerStatus(playerid);
      // If started, get the first question
      if (data) {
        await fetchPlayerQuestion(playerid);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // On question ended - Wait for new question after previous question has ended
  useEffect(async () => {
    let timer;
    if (questionEnd && !quizEnd) {
      // Check if session started every second
      timer = setInterval(async () => {
        const newQ = await fetchPlayerQuestion(playerid);
        if (newQ) {
          clearInterval(timer);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [questionEnd]);

  // Render Lobby Screen
  if (!playerStatus) {
    return (
      <ContentWrapper center>
        <AuthCard className='shadow'>
          <Card.Body>
            <h4>Waiting for game to start</h4><br/>
            <div><Spinner animation='border'/></div><br/>
          </Card.Body>
        </AuthCard>
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper center>
        <Card className='shadow'>
          <Card.Body>
            { playerQuestion &&
              <PlayQuestionCard
                question={playerQuestion}
                playerid={playerid}
                quizEnd={quizEnd}
                questionEnd={questionEnd}
                setQuestionEnd={setQuestionEnd}
              />
            }
          </Card.Body>
        </Card>
    </ContentWrapper>
  )
}

export default SessionPlay;
