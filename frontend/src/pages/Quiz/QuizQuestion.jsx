import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/Auth';
import { Card, Container, Button, Form, ButtonGroup, ToggleButton, Row, Col, Alert, Image, Ratio } from 'react-bootstrap';
import useQuestionFetch from '../../hooks/useQuestionFetch';
import API from '../../utils/API';
import { fileToDataUrl, youtubeUrlEmbed } from '../../utils/utils';

// Components
import QuestionAnswersForm from '../../components/QuestionAnswersForm';

const QuizQuestion = () => {
  const { quizid, questionid } = useParams();
  const { token, setTitle } = useAuth();
  const { state } = useLocation();
  const { question } = useQuestionFetch(token, quizid, questionid);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [media, setMedia] = useState(question.media);
  const [questionCopy, setQuestionCopy] = useState(question);
  const [answers, setAnswers] = useState(questionCopy.answers);
  const [answer, setAnswer] = useState(questionCopy.answer);
  const [fileInvalid, setFileInvalid] = useState(false);

  // Update App Title
  useEffect(() => {
    if (question.quizid !== -1) setTitle('Edit Question');
    else setTitle('Add Question');
  }, [question]);

  // Update question copy
  useEffect(() => {
    if (question) setQuestionCopy(question);
  }, [question]);

  // Update Quiz Question Call
  const updateQuizQuestion = async (quiz, question) => {
    if (!quiz) return false;
    const found = quiz.questions.findIndex(({ questionid }) => questionid === question.questionid);
    if (found === -1) quiz.questions.push(question);
    else quiz.questions[found] = question;
    const data = await API.updateQuiz(token, quizid, quiz);
    if (data.error) {
      console.error(data.error);
    } else return true;
    return false;
  }

  // Save Button Handler
  const handleSave = async (event) => {
    event.preventDefault();
    const body = questionCopy;
    body.quizid = parseInt(quizid, 10);
    body.questionid = parseInt(questionid, 10);
    body.media = media;
    if (media.type === 'url') {
      const url = youtubeUrlEmbed(media.content);
      body.media.content = url;
    }
    const numAnswers = answers.reduce((sum, curr) => sum + !!curr, 0);
    const numAnswer = answer.reduce((sum, curr) => sum + !!curr, 0);
    if (numAnswers < 2) {
      setError('Not enough answers created');
      return;
    } else {
      body.answers = answers.slice(0, numAnswers);
    }
    if (questionCopy.type === 'single' && numAnswer !== 1) {
      setError('Invalid number of correct answers');
      return;
    } else if (questionCopy.type === 'multiple' && (numAnswer < 1 || numAnswer > numAnswers)) {
      setError('Invalid number of correct answers');
      return;
    } else {
      body.answer = answer.slice(0, numAnswers);
    }
    const updated = await updateQuizQuestion(state.quiz, body);
    if (updated) navigate(`/quiz/edit/${quizid}`);
  }

  // Cancel button handler
  const handleCancel = (event) => {
    event.preventDefault();
    navigate(`/quiz/edit/${quizid}`);
  }

  // Media change Handler
  const handleMediaUpload = async (event) => {
    if (media.type === 'file') {
      try {
        setFileInvalid(false);
        const data = await fileToDataUrl(event.target.files[0]);
        if (data) setMedia({ type: 'file', content: data });
      } catch {
        console.error('Invalid file type');
        setFileInvalid(true);
      }
    } else setMedia({ type: 'url', content: event.target.value });
  }

  return (
    <Container>
      <Card className='shadow mt-3'>
        <Card.Body>
          <Container>
            { error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert> }
            <Form>
              {/* Question Input */}
              <Form.Group className='mb-3'>
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type='text'
                  as='textarea'
                  onChange={(e) => setQuestionCopy(prev => {
                    return { ...prev, question: e.target.value }
                  })}
                  value={questionCopy.question}
                  placeholder='Enter question'
                ></Form.Control>
              </Form.Group>

              {/* Question Type Buttons */}
              <Form.Group>
                <Form.Label>Question Type:</Form.Label><br/>
                <ButtonGroup className='mb-2'>
                  <ToggleButton
                    name='typeChoice'
                    id='single'
                    type='radio'
                    onChange={(e) => setQuestionCopy(prev => {
                      return { ...prev, type: 'single' }
                    })}
                    checked={questionCopy.type === 'single'}
                  >
                    Single Choice
                  </ToggleButton>
                  <ToggleButton
                    name='typeChoice'
                    id='multiple'
                    type='radio'
                    onChange={(e) => setQuestionCopy(prev => {
                      return { ...prev, type: 'multiple' }
                    })}
                    checked={questionCopy.type === 'multiple'}
                  >
                    Multiple Choice
                  </ToggleButton>
                </ButtonGroup>
              </Form.Group>

              {/* Time Limit Input */}
              <Form.Group>
                <Form.Label>Time Limit:</Form.Label>
                <Container fluid>
                  {/* TODO: Make two sliders, one for minutes and seconds */}
                  <Row>
                    <Col>
                      <Form.Range
                        value={questionCopy.duration}
                        onChange={(e) => setQuestionCopy(prev => {
                          return { ...prev, duration: parseInt(e.target.value, 10) }
                        })}
                        min={5}
                        max={5 * 60}
                        step={5}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Control
                        type='number'
                        value={Math.floor(questionCopy.duration / 60)}
                        readOnly
                      />
                      <Form.Label>minutes</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type='number'
                        value={questionCopy.duration % 60}
                        readOnly
                      />
                      <Form.Label>seconds</Form.Label>
                    </Col>
                  </Row>
                </Container>
              </Form.Group>

              {/* Points Input */}
              <Form.Group className='mb-2'>
                <Form.Label>Points:</Form.Label>
                <Form.Control
                  type='number'
                  step={5}
                  min={0}
                  value={questionCopy.points}
                  onChange={(e) => setQuestionCopy(prev => {
                    return { ...prev, points: parseInt(e.target.value, 10) }
                  })}
                ></Form.Control>
              </Form.Group>

              {/* Media Input */}
              <Form.Group className='mb-2'>
                <Form.Label>Media:</Form.Label><br/>
                <ButtonGroup className='mb-2'>
                  <ToggleButton
                    name='mediaChoice'
                    type='radio'
                    onClick={() => setMedia({ type: 'url', content: '' })}
                    checked={media.type === 'url'}
                  >
                    Youtube URL
                  </ToggleButton>
                  <ToggleButton
                    name='mediaChoice'
                    type='radio'
                    onClick={() => setMedia({ type: 'file', content: '' })}
                    checked={media.type === 'file'}
                  >
                    Image
                  </ToggleButton>
                </ButtonGroup>
                <Form.Control
                  type={media.type}
                  onChange={handleMediaUpload}
                  placeholder={media.type === 'url' ? 'https://www.youtube.com/...' : ''}
                  // value={media.type === 'url' ? media.content : ''}
                  isInvalid={media.type === 'file' && fileInvalid}
                ></Form.Control>
                { media.type === 'file' && questionCopy.media.type === 'file' && questionCopy.media.content !== '' &&
                  <Image thumbnail src={questionCopy.media.content} width='100px' height='100px'></Image>
                }
                { media.type === 'url' && questionCopy.media.type === 'url' && questionCopy.media.content !== '' &&
                  <Ratio aspectRatio='16x9'>
                    <iframe
                      title='Question Media'
                      src={questionCopy.media.content}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </Ratio>
                }
                {/* { media === 'url'
                  ? (<Form.Control
                      type='url'
                      onChange={(e) => setQuestionCopy(prev => {
                        return { ...prev, media: { ...prev.media, content: e.target.value } }
                      })}
                    ></Form.Control>)
                  : (<Form.Control
                      type='file'
                      onChange={(e) => setQuestionCopy(prev => {
                        return { ...prev, media: { ...prev.media, content: e.target.value } }
                      })}
                    ></Form.Control>)
                } */}
              </Form.Group>

              {/* Answers Input */}
              <Form.Group className='mb-2'>
                <Form.Label>Answers:</Form.Label><br/>
                <QuestionAnswersForm
                  questionType={questionCopy.type}
                  setAnswersList={setAnswers}
                  setAnswer={setAnswer}
                  answersList={questionCopy.answers}
                  answer={questionCopy.answer}
                />
              </Form.Group>
            </Form>
            <Button variant='primary' onClick={handleSave}>Save</Button>
            <Button variant='danger' onClick={handleCancel}>Cancel</Button>
          </Container>
        </Card.Body>
      </Card>
    </Container>

  )
}

QuizQuestion.propTypes = {
  updateQuestion: PropTypes.func,
  questions: PropTypes.array
}

export default QuizQuestion;
