import { useState, useEffect } from 'react';
import API from '../utils/API';

const defaultQuestion = {
  quizid: -1,
  questionid: -1,
  question: '',
  type: 'single',
  duration: 5,
  points: 0,
  media: {
    type: 'url',
    content: '',
  },
  answers: [],
  answer: [],
}

const defaultQuiz = {
  questions: [
    defaultQuestion,
  ],
  createdAt: '',
  name: '',
  thumbnail: '',
  owner: '',
  active: null,
  oldSessions: [],
};

const useQuizFetch = (token, quizid) => {
  const [quiz, setQuiz] = useState(defaultQuiz);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState('');

  const fetchQuiz = async (token, quizid) => {
    const id = parseInt(quizid, 10);
    try {
      setQuizError('');
      setQuizLoading(true);
      const data = await API.getQuiz(token, id);
      if (!data.error) setQuiz(data);
      else setQuizError('Could not obtain quiz');
    } catch (error) {
      setQuizError('Could not obtain quiz');
    }
    setQuizLoading(false);
  };

  useEffect(() => {
    if (token && quizid) fetchQuiz(token, quizid);
  }, [token, quizid]);

  return { quiz, quizLoading, quizError, fetchQuiz };
};

export default useQuizFetch;
