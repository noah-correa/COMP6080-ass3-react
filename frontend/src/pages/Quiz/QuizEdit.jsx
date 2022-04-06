import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import useQuizFetch from '../../hooks/useQuizFetch';
import QuestionCard from '../../components/QuestionCard';
import API from '../../utils/API';
import { useAuth } from '../../utils/Auth';
import { fileToDataUrl, generateId } from '../../utils/utils';
import Loading from '../../components/Loading';
import ContentWrapper from '../../components/ContentWrapper';

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

  if (loading || quizLoading) return <Loading/>;

  return (
    <ContentWrapper>
      <Card className='shadow'>
        <Card.Body>
          <Form>
            <InputGroup>
              <InputGroup.Text>Quiz Name</InputGroup.Text>
              <FormControl type='text' placeholder={quiz.name} value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
              <Button variant='outline-primary' onClick={handleNameUpdate}>Update</Button>
            </InputGroup>
            <p>Owner: {quiz.owner}</p>
            <p>Created: {new Date(quiz.createdAt).toLocaleString()}</p>
            <p>Total Duration: {totalDuration} seconds</p>
            <InputGroup>
              <InputGroup.Text>Thumbnail</InputGroup.Text>
              <FormControl type='file' isInvalid={thumbnailInvalid} onChange={(e) => setUpdateThumbnail(e.target.files && e.target.files[0])}/>
              <Button variant='outline-primary' onClick={handleThumbnailUpdate}>Update</Button>
            </InputGroup>
            <Image thumbnail src={quiz.thumbnail || ''} alt='No image' width='100px' height='100px'></Image>
            { quiz && <p>{quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}</p> }
          </Form>
        </Card.Body>
      </Card>
      <Card className='shadow'>
        <Card.Body>
          <div className='d-grid gap-2'>
            <Button variant='primary' onClick={handleNewQuestion}>Add new question</Button>
          </div>
          <ListGroup>
            { quiz &&
              quiz.questions.map((question, index) => (
                <ListGroup.Item key={index}>
                  <QuestionCard question={question} quiz={quiz} updateQuiz={updateQuiz}></QuestionCard>
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </Card.Body>
      </Card>
      <Outlet/>
    </ContentWrapper>
  )
}

export default QuizEdit;
