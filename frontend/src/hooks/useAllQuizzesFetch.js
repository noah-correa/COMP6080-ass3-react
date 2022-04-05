import { useState, useEffect } from 'react';
import API from '../utils/API';

const useAllQuizzesFetch = (token) => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [quizzesError, setQuizzesError] = useState('');

  const fetchAllQuizzes = async (token) => {
    try {
      setQuizzesError('');
      setQuizzesLoading(true);
      const data = await API.getAllQuizzes(token);
      if (!data.error) setQuizzes(data.quizzes);
      else setQuizzesError('Could not obtain quiz');
    } catch (error) {
      setQuizzesError('Could not obtain quiz');
    }
    setQuizzesLoading(false);
  };

  useEffect(() => {
    fetchAllQuizzes(token);
  }, [token]);

  return { quizzes, quizzesLoading, quizzesError, fetchAllQuizzes };
};

export default useAllQuizzesFetch;
