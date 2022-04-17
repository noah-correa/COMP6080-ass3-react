import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../utils/Auth';
import API from '../utils/API';
import QuizCard from '../components/QuizCard';
import { Button, Card, Collapse, InputGroup, FormControl, Alert } from 'react-bootstrap';
import useAllQuizzesFetch from '../hooks/useAllQuizzesFetch';
import Loading from '../components/Loading';
import ContentWrapper from '../components/ContentWrapper';

const Dashboard = () => {
  const { token, setTitle } = useAuth();
  const { quizzes, quizzesLoading, quizzesError, fetchAllQuizzes } = useAllQuizzesFetch(token);
  const createQuizNameRef = useRef('');
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Change document title
  useEffect(() => {
    setTitle('Dashboard');
  }, []);

  // Create Quiz Button Handler
  const handleCreateQuiz = async (event) => {
    event.preventDefault();
    if (!createQuizNameRef.current.value) {
      setError('Invalid quiz name');
    } else {
      setLoading(true);
      const data = await API.createQuiz(token, createQuizNameRef.current.value);
      if (data.error) {
        console.error('Could not create quiz');
        setError('Could not create quiz, please try again later');
      } else {
        setError('');
        setSuccess(true);
        createQuizNameRef.current = '';
        await fetchAllQuizzes(token);
      }
      setLoading(false);
    }
  }

  if (loading || quizzesLoading) return <Loading/>;

  return (
    <ContentWrapper>
      <Card className='shadow'>
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
                  { success &&
                    <Alert dismissible variant='success' onClose={() => { setSuccess(false) }}>
                      Quiz created!
                    </Alert>
                  }
                </div>
              </Collapse>
        </Card.Body>
      </Card>
      { (error || quizzesError) && <Alert dismissible variant='danger' onClose={() => setError('')}>{error || quizzesError}</Alert>}
      { quizzes.length === 0
        ? (<QuizCard empty/>)
        : (quizzes.map((quiz, index) => (
            <QuizCard quizid={quiz.id} key={index} fetchAllQuizzes={fetchAllQuizzes}/>
          )))
      }
    </ContentWrapper>
  )
}

export default Dashboard;
