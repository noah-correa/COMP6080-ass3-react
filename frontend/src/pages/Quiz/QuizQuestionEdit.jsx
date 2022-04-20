import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/Auth';
import { Card, Button, Form, ButtonGroup, ToggleButton, Alert, Image, Ratio } from 'react-bootstrap';
import useQuestionFetch from '../../hooks/useQuestionFetch';
import API from '../../utils/API';
import { fileToDataUrl, youtubeUrlEmbed } from '../../utils/utils';
import styled from 'styled-components';
import QuestionOptionsForm from '../../components/QuestionOptionsForm';
import Loading from '../../components/Loading';
import ContentWrapper from '../../components/ContentWrapper';

const Divider = styled.hr`
  color: grey;
  /* background-color: #46178f; */
  width: 100%;
  height: 1;
`;

const QuizQuestionEdit = () => {
  const { quizid, questionid } = useParams();
  const { token, setTitle } = useAuth();
  const { state } = useLocation();
  const { question, questionLoading } = useQuestionFetch(token, quizid, questionid);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [media, setMedia] = useState({ type: 'url', content: '' });
  const [questionCopy, setQuestionCopy] = useState(question);
  const [options, setOptions] = useState(questionCopy.options);
  const [correct, setCorrect] = useState(questionCopy.correct);
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

  // Update question copy
  useEffect(() => {
    if (question.media) setMedia(question.media);
  }, [question]);

  // Update Quiz Question Call
  const updateQuizQuestion = async (quiz, question) => {
    if (!quiz) return false;
    const found = quiz.questions.findIndex(({ questionid }) => questionid === question.questionid);
    if (found === -1) quiz.questions.push(question);
    else quiz.questions[found] = question;
    setLoading(true);
    const data = await API.updateQuiz(token, quizid, quiz);
    setLoading(false);
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
      if (media.content) {
        const url = youtubeUrlEmbed(media.content);
        body.media.content = url;
      } else body.media.content = '';
    }
    const numOptions = options.reduce((sum, curr) => sum + !!curr, 0);
    const numCorrect = correct.length;
    if (numOptions < 2) {
      setError('Not enough answers created');
      return;
    } else {
      body.options = options.slice(0, numOptions);
    }
    if (questionCopy.type === 'single' && numCorrect !== 1) {
      setError('Invalid number of correct answers for single choice');
      return;
    } else if (questionCopy.type === 'multiple' && (numCorrect < 1 || numCorrect > numOptions)) {
      setError('Invalid number of correct answers for multiple choice');
      return;
    } else {
      body.correct = correct.slice(0, numOptions);
    }
    const updated = await updateQuizQuestion(state.quiz, body);
    if (updated) navigate(`/quiz/edit/${quizid}`);
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

  if (loading || questionLoading) return <Loading/>;

  return (
    <ContentWrapper>
      <Card className='shadow'>
        <Card.Body>
            { error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert> }
            <Form className='d-flex flex-column align-items-center'>
              {/* Question Input */}
              <Form.Group className='w-75'>
                <Form.Label className='d-flex justify-content-center'><h6 className='m-0'>Question</h6></Form.Label>
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
              <Divider/>
              {/* Time Limit Input */}
              <Form.Group className='d-flex w-75 gap-2 flex-column align-items-center'>
                <Form.Label className='m-0'><h6 className='m-0'>Time Limit</h6></Form.Label>
                  <Form.Range
                    value={questionCopy.duration}
                    onChange={(e) => setQuestionCopy(prev => {
                      return { ...prev, duration: parseInt(e.target.value, 10) }
                    })}
                    min={5}
                    max={5 * 60}
                    step={5}
                  />
                  <div className='d-flex gap-2 align-items-center'>
                    <div className='d-flex w-50 flex-column align-items-center'>
                      <Form.Control
                        type='number'
                        min={0}
                        max={5}
                        value={Math.floor(questionCopy.duration / 60)}
                        onChange={(e) => setQuestionCopy(prev => {
                          const t = parseInt(e.target.value, 10) * 60 + prev.duration % 60;
                          if (t < 5) return { ...prev, duration: 5 };
                          if (t > 5 * 60) return { ...prev, duration: 5 * 60 };
                          return { ...prev, duration: t };
                        })}
                      />
                      <Form.Label>minutes</Form.Label>
                    </div>
                    <div className='d-flex w-50 flex-column align-items-center'>
                      <Form.Control
                        type='number'
                        min={0}
                        max={59}
                        value={questionCopy.duration % 60}
                        onChange={(e) => setQuestionCopy(prev => {
                          const t = parseInt(e.target.value, 10) + Math.floor(prev.duration / 60) * 60;
                          if (t < 5) return { ...prev, duration: 5 };
                          return { ...prev, duration: t }
                        })}
                      />
                      <Form.Label className='d-flex justify-content-center'>seconds</Form.Label>
                    </div>
                  </div>
              </Form.Group>
              <Divider/>
              {/* Points Input */}
              <Form.Group className='d-flex w-75 gap-2 flex-column align-items-center'>
                <Form.Label className='m-0'><h6 className='m-0'>Points</h6></Form.Label>
                <Form.Control
                  className='w-25'
                  type='number'
                  min={0}
                  value={questionCopy.points}
                  onChange={(e) => setQuestionCopy(prev => {
                    return { ...prev, points: parseInt(e.target.value, 10) }
                  })}
                ></Form.Control>
              </Form.Group>
              <Divider/>
              {/* Media Input */}
              <Form.Group className='d-flex w-100 gap-2 flex-column align-items-center'>
                <Form.Label className='m-0'><h6 className='m-0'>Media</h6></Form.Label>
                <div className='d-flex w-100 align-items-center justify-content-between'>
                  <ButtonGroup>
                    <ToggleButton
                      name='mediaChoice'
                      type='radio'
                      onClick={() => setMedia({ type: 'url', content: questionCopy.media.type === 'url' ? question.media.content : '' })}
                      checked={media.type === 'url'}
                    >
                      Youtube URL
                    </ToggleButton>
                    <ToggleButton
                      name='mediaChoice'
                      type='radio'
                      onClick={() => setMedia({ type: 'file', content: questionCopy.media.type === 'file' ? question.media.content : '' })}
                      checked={media.type === 'file'}
                    >
                      Image
                    </ToggleButton>
                  </ButtonGroup>
                  <Button variant='outline-danger' onClick={() => setMedia({ type: media.type, content: '' })}>Remove Media</Button>
                </div>
                <Form.Control
                  type={media.type}
                  onChange={handleMediaUpload}
                  placeholder={media.type === 'url' ? 'https://www.youtube.com/...' : ''}
                  isInvalid={media.type === 'file' && fileInvalid}
                ></Form.Control>
                { media.type === 'file' && media.content && questionCopy.media.type === 'file' && questionCopy.media.content !== '' &&
                  <div className='w-75'>
                    <Image fluid thumbnail src={media.content} height='100%'></Image>
                  </div>
                }
                { media.type === 'url' && media.content && questionCopy.media.type === 'url' && questionCopy.media.content !== '' &&
                  <Ratio aspectRatio='16x9'>
                    <iframe
                      title='Question Media'
                      src={media.content}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </Ratio>
                }
              </Form.Group>
              <Divider/>
              {/* Answers Input */}
              <Form.Group className='d-flex gap-2 flex-column align-items-center'>
                <Form.Label className='m-0'><h6 className='m-0'>Answers</h6></Form.Label>
                <ButtonGroup>
                  <ToggleButton
                    name='typeChoice'
                    id='single'
                    type='radio'
                    onChange={() => setQuestionCopy(prev => {
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
                    onChange={() => setQuestionCopy(prev => {
                      return { ...prev, type: 'multiple' }
                    })}
                    checked={questionCopy.type === 'multiple'}
                  >
                    Multiple Choice
                  </ToggleButton>
                </ButtonGroup>
                <QuestionOptionsForm
                  questionType={questionCopy.type}
                  setOptions={setOptions}
                  setCorrect={setCorrect}
                  options={questionCopy.options}
                  correct={questionCopy.correct}
                />
              </Form.Group>
            </Form>
            <Button variant='primary' onClick={handleSave}>Save</Button>
            <Button variant='danger' onClick={() => navigate(`/quiz/edit/${quizid}`)}>Cancel</Button>
        </Card.Body>
      </Card>
    </ContentWrapper>

  )
}

QuizQuestionEdit.propTypes = {
  updateQuestion: PropTypes.func,
  questions: PropTypes.array
}

export default QuizQuestionEdit;
