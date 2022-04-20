import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import useQuizFetch from '../../hooks/useQuizFetch';
import QuestionCard from '../../components/QuestionCard';
import API from '../../utils/API';
import { useAuth } from '../../utils/Auth';
import { fileToDataUrl, generateId, formatDuration } from '../../utils/utils';
import Loading from '../../components/Loading';
import ContentWrapper from '../../components/ContentWrapper';
import { BsPlusCircle, BsQuestionCircle, BsStopwatch, BsCalendarWeek } from 'react-icons/bs';

const QuizEdit = () => {
  const { quizid } = useParams();
  const { setTitle, token } = useAuth();
  const navigate = useNavigate();
  const { quiz, quizLoading, fetchQuiz } = useQuizFetch(token, quizid);
  const [loading, setLoading] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [updateName, setUpdateName] = useState('');
  const [updateThumbnail, setUpdateThumbnail] = useState(null);
  const [thumbnailInvalid, setThumbnailInvalid] = useState(false);

  // Return if quiz id was invalid
  if (!quizid) {
    return (
      <ContentWrapper>
        <Card className='shadow'>
          <Card.Body>
            <p>Invalid Quiz</p>
          </Card.Body>
        </Card>
      </ContentWrapper>
    );
  }

  // Update App Title
  useEffect(() => {
    setTitle('Edit Quiz');
  }, []);

  // Calculate total time
  useEffect(() => {
    const total = quiz.questions.reduce((sum, q) => sum + q.duration, 0);
    setTotalDuration(total);
  }, [quiz])

  // Update quiz field function
  const updateQuiz = async (body) => {
    setLoading(true);
    const data = await API.updateQuiz(token, quizid, body);
    if (data.error) {
      console.error(data.error);
    } else {
      fetchQuiz(token, quizid);
    }
    setLoading(false);
  }

  // Name update handler
  const handleNameUpdate = async (event) => {
    event.preventDefault();
    const body = { ...quiz };
    if (updateName) {
      body.name = updateName;
      setUpdateName('');
      updateQuiz(body);
    }
  }

  // Thumbnail update handler
  const handleThumbnailUpdate = async (event) => {
    event.preventDefault();
    const body = { ...quiz };
    if (updateThumbnail) {
      try {
        setThumbnailInvalid(false);
        const data = await fileToDataUrl(updateThumbnail);
        if (data) body.thumbnail = data;
        updateQuiz(body);
      } catch {
        console.error('Invalid file type');
        setThumbnailInvalid(true);
      }
      setUpdateThumbnail(null);
    }
  }

  // New Question button handler
  const handleNewQuestion = (event) => {
    event.preventDefault();
    const newId = generateId();
    navigate(`/quiz/edit/${quizid}/${newId}`, { state: { quiz: quiz } });
  }

  // Cancel Button handler
  const handleCancel = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  }

  const getCreatedDate = (date) => new Date(date).toLocaleDateString();
  const getCreatedTime = (date) => new Date(date).toLocaleTimeString();

  if (loading || quizLoading) return <Loading/>;

  return (
    <ContentWrapper>
      <Card className='shadow'>
        <Card.Body>
          <div className='d-flex mb-2 justify-content-between'>
            <Button variant='primary' onClick={handleNewQuestion} className='mw-50'><BsPlusCircle/> Add new question</Button>
            <Button variant='danger' onClick={handleCancel} className='mw-50'>Cancel</Button>
          </div>
          <Form>
            <Form.Label><h6 className='mb-0'>Quiz Name</h6></Form.Label>
            <InputGroup>
              <FormControl type='text' size='sm' placeholder={quiz.name} value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
              <Button variant='outline-primary' size='sm' onClick={handleNameUpdate}>Update</Button>
            </InputGroup>
            <div className='d-flex mt-2 align-items-center justify-content-between'>
              <div>
                <p><BsCalendarWeek/> <span><span>{getCreatedDate(quiz.createdAt)}</span>, <span className='text-nowrap'>{getCreatedTime(quiz.createdAt)}</span></span></p>
                <p><BsQuestionCircle/> {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}</p>
                <p><BsStopwatch/> {formatDuration(totalDuration)}</p>
              </div>
              <div className='w-50 d-flex'>
                <Image className='ms-auto' fluid thumbnail src={quiz.thumbnail || ''} alt='No thumbnail' width='100%' height='100%'></Image>
              </div>
            </div>
            <Form.Label><h6 className='mb-0'>Thumbnail</h6></Form.Label>
            <InputGroup>
              <FormControl type='file' size='sm' isInvalid={thumbnailInvalid} onChange={(e) => setUpdateThumbnail(e.target.files && e.target.files[0])}/>
              <Button variant='outline-primary' size='sm' onClick={handleThumbnailUpdate}>Update</Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
      <Card className='shadow'>
        <Card.Body>
          <Card.Title className='text-center'>Question List</Card.Title>
          <ListGroup>
            { quiz &&
              quiz.questions.map((question, index) => (
                <ListGroup.Item key={index}>
                  <QuestionCard question={question} quiz={quiz} updateQuiz={updateQuiz}></QuestionCard>
                </ListGroup.Item>
              ))
            }
            { quiz && !quiz.questions.length &&
              <ListGroup.Item>
                <i>No questions to display</i>
              </ListGroup.Item>
            }
          </ListGroup>
        </Card.Body>
      </Card>
      <Outlet/>
    </ContentWrapper>
  )
}

export default QuizEdit;
