import React from 'react';
import PropTypes from 'prop-types';
import { Button, Image, Ratio, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsCheckCircle, BsCheckSquare, BsStopwatch, BsStar } from 'react-icons/bs';
import { formatDuration } from '../utils/utils';

const QuestionCard = ({ quiz, question, updateQuiz }) => {
  const navigate = useNavigate();

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
      <h5>Q{quiz.questions.indexOf(question) + 1} - {question.question}</h5>
      <div className='d-flex gap-2 align-items-center justify-content-between'>
        <div>
          <p>{question.type === 'single' ? <BsCheckCircle/> : <BsCheckSquare/>} {question.type.charAt(0).toUpperCase() + question.type.slice(1)} Choice</p>
          <p><BsStar/> {question.points} points</p>
          <p><BsStopwatch/> {formatDuration(question.duration)}</p>
        </div>
        { question.media.content &&
          <div className='d-flex w-50 align-items-center justify-content-center'>
            { (question.media.type === 'file' && question.media.content)
              ? <div className='w-100'>
                  <Image fluid thumbnail src={question.media.content} alt='No image' width='100%' height='100%'/>
                </div>
              : <Ratio aspectRatio='16x9'>
                  <iframe
                    title='Question Media'
                    src={question.media.content}
                    allow="accelerometer; clipboard-write; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </Ratio>
            }
          </div>
        }
        <div>
          <Stack gap={2}>
            <Button variant='primary' onClick={handleEdit}>Edit</Button>
            <Button variant='danger' onClick={handleDelete}>Delete</Button>
          </Stack>
        </div>
      </div>
    </>
  )
}

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  quiz: PropTypes.object.isRequired,
  updateQuiz: PropTypes.func.isRequired,
}

export default QuestionCard;
