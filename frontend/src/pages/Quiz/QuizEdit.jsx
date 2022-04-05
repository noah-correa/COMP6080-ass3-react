import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import QuestionCard from '../../components/QuestionCard';
import useQuizFetch from '../../hooks/useQuizFetch';
import API from '../../utils/API';
import { useAuth } from '../../utils/Auth';
import { fileToDataUrl } from '../../utils/utils';

const QuizEdit = () => {
  const { quizid } = useParams();
  const { setTitle, token } = useAuth();
  const { quiz } = useQuizFetch(token, quizid);
  const navigate = useNavigate();
  const [quizCopy, setQuizCopy] = useState(quiz);
  const [updateName, setUpdateName] = useState('');
  const [updateThumbnail, setUpdateThumbnail] = useState(null);
  const [thumbnailInvalid, setThumbnailInvalid] = useState(false);

  // Update App Title
  useEffect(() => {
    setTitle('Edit Quiz');
  }, []);

  // Update Quiz Copy
  useEffect(() => {
    if (quiz) setQuizCopy(quiz);
  }, [quiz]);

  if (!quizid) {
    return (
      <Card>
        <Card.Body className='shadow mt-3'>
          <p>Invalid Quiz</p>
        </Card.Body>
      </Card>
    );
  }

  const updateQuiz = async (body) => {
    const data = await API.updateQuiz(token, quizid, body);
    if (data.error) {
      console.error(data.error);
    } else {
      navigate(0);
    }
  }

  const handleNameUpdate = async (event) => {
    event.preventDefault();
    const body = { ...quiz };
    if (updateName) {
      body.name = updateName;
      setUpdateName('');
      updateQuiz(body);
    }
  }

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

  const handleNewQuestion = (event) => {
    event.preventDefault();
    navigate(`/quiz/edit/${quizid}/${quiz.questions.length + 1}`, { state: { quiz: quizCopy } });
  }

  return (
    <Container>
      <Card className='shadow mt-3'>
        <Card.Body>
          <Form>
            <InputGroup>
              <InputGroup.Text>Quiz Name</InputGroup.Text>
              <FormControl type='text' placeholder={quiz.name} value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
              <Button variant='outline-primary' onClick={handleNameUpdate}>Update</Button>
            </InputGroup>
            <p>Owner: {quiz.owner}</p>
            <p>Created: {new Date(quiz.createdAt).toLocaleString()}</p>
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
      <Card className='shadow mt-2'>
        <Card.Body>
          <div className='d-grid gap-2 mb-2'>
            <Button variant='primary' onClick={handleNewQuestion}>Add new question</Button>
          </div>
          <ListGroup>
            { quiz &&
              quiz.questions.map((question, index) => (
                <ListGroup.Item key={index}>
                  {/* Q{index + 1}: {question.question} */}
                  <QuestionCard question={question} quiz={quiz}></QuestionCard>
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </Card.Body>
      </Card>
      <Outlet/>
    </Container>
  )
}

export default QuizEdit;
