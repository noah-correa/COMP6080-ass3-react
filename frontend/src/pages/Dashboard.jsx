import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../utils/Auth';
import API from '../utils/API';
import QuizCard from '../components/QuizCard';
import { Container, Button, Card, Collapse, InputGroup, FormControl, Alert } from 'react-bootstrap';

const Dashboard = () => {
  const { token, setTitle } = useAuth();
  const createQuizNameRef = useRef('');
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [error, setError] = useState('');
  const [quizzesError, setQuizzesError] = useState('');
  const [success, setSuccess] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  // Change document title
  useEffect(() => {
    setTitle('Dashboard');
  }, []);

  // Fetch all quizzes function
  const fetchAllQuizzes = async (token) => {
    const data = await API.getAllQuizzes(token);
    if (data.error) {
      console.error(data.error);
      setError('Could not get quizzes');
    } else {
      setQuizzes(data.quizzes);
      setError('');
    }
  }

  // Fetch all quizzes from backend
  useEffect(async () => {
    if (token) await fetchAllQuizzes(token);
  }, [token]);

  // Create Quiz Button Handler
  const handleCreateQuiz = async (event) => {
    event.preventDefault();
    if (!createQuizNameRef.current.value) {
      setQuizzesError('Invalid quiz name');
    } else {
      const data = await API.createQuiz(token, createQuizNameRef.current.value);
      if (data.error) {
        console.error('Could not create quiz');
        setQuizzesError('Could not create quiz, please try again later');
      } else {
        setQuizzesError('');
        setSuccess(true);
        createQuizNameRef.current.value = '';
        fetchAllQuizzes(token);
      }
    }
  }

  return (
    <Container className='mt-3'>
      <Card className='shadow-sm mb-3'>
        <Card.Body className='d-grid gap-2'>
            <Button
              variant='primary'
              type='button'
              onClick={() => setShowCreateQuiz(!showCreateQuiz)}
            >
              Create a new quiz
            </Button>
              <Collapse in={showCreateQuiz}>
                <div>
                  <InputGroup className='mb-2'>
                    <FormControl placeholder='Enter quiz name' ref={createQuizNameRef}></FormControl>
                    <Button variant='outline-primary' onClick={handleCreateQuiz}>Create</Button>
                  </InputGroup>
                  { quizzesError &&
                    <Alert dismissible variant='danger' onClose={() => { setQuizzesError('') }}>
                      { quizzesError }
                    </Alert>
                  }
                  { success &&
                    <Alert dismissible variant='success' onClose={() => { setSuccess(false) }}>
                      Quiz created!
                    </Alert>
                  }
                </div>
              </Collapse>
        </Card.Body>
      </Card>
      { error && <Alert dismissible variant='danger' onClose={() => setError('')}>{error}</Alert>}
      {
        quizzes.length === 0
          ? (<QuizCard empty/>)
          : (quizzes.map((quiz, index) => (
              <QuizCard quiz={quiz} key={index} fetchQuizzes={fetchAllQuizzes}/>
            )))
      }
    </Container>
  )
}

export default Dashboard;
