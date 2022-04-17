import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { Image, Ratio } from 'react-bootstrap';
import CountdownTimer from './CountdownTimer';
import API from '../utils/API';
import QuizOptions from './QuizOptions';

const PlayQuestionCard = ({ question, playerid, quizEnd, questionEnd, setQuestionEnd }) => {
  const [correct, setCorrect] = useState([]);

  // Fetch Correct Answer from backend
  const fetchCorrectAnswer = async () => {
    const data = await API.getCorrectAnswer(playerid);
    setCorrect(data.answerIds);
  }

  // Update selected answers
  const updateSelected = async (answer) => {
    if (answer.length === 0) return;
    const data = await API.submitAnswer(playerid, answer);
    if (data.error) {
      console.error(data.error);
    }
  }

  // Run when the question timer runs out
  const handleQuestionEnd = () => {
    // Delay correct answer call by 1 second to ensure valid call
    const timer = setTimeout(fetchCorrectAnswer, 1000);
    fetchCorrectAnswer();
    setQuestionEnd(true);
    return () => clearTimeout(timer);
  }

  if (!question || !question.media) return <Loading/>

  return (
    <>
      { ((!quizEnd && question) || console.log(question)) &&
        <>
          <h5>Question: </h5><p>{question.question}</p>
          <p>Points: {question.points}</p>
          <div>
            <CountdownTimer
              timer={{
                start: question.isoTimeLastQuestionStarted,
                duration: question.duration,
              }}
              onEnd={handleQuestionEnd}
            />
          </div>
          <br/>
          { !question.media.content && <p>No media attached</p>}
          { question.media.content && question.media.type === 'file' &&
            <Image thumbnail src={question.media.content} alt='No image' width='100px' height='100px'/>
          }
          { question.media.content && question.media.type === 'url' &&
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
          <QuizOptions
            questionType={question.type}
            options={question.options}
            updateSelected={updateSelected}
            disabled={questionEnd}
            correct={correct || []}
          />
          { correct && questionEnd &&
            <div>
              <Loading variant='dark'/>
              <p className='text-center'>Waiting for next question</p>
            </div>
          }
        </>
      }
      { quizEnd &&
        <div>Quiz ended</div>
      }
    </>
  )
}

PlayQuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  playerid: PropTypes.number.isRequired,
  quizEnd: PropTypes.bool.isRequired,
  questionEnd: PropTypes.bool.isRequired,
  setQuestionEnd: PropTypes.func.isRequired,
}

export default PlayQuestionCard;
