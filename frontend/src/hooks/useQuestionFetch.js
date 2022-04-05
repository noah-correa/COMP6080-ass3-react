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

const useQuestionFetch = (token, quizid, questionid) => {
  const [question, setQuestion] = useState(defaultQuestion);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [questionError, setQuestionError] = useState('');

  const fetchQuestion = async (token, quizid, questionid) => {
    const id = parseInt(quizid, 10);
    const qid = parseInt(questionid, 10);
    try {
      setQuestionError('');
      setQuestionLoading(true);
      const data = await API.getQuiz(token, id);
      if (!data.error) {
        const found = data.questions.find((question) => question.questionid === qid);
        if (found) setQuestion(found);
      } else setQuestionError('Could not obtain quiz');
    } catch (error) {
      setQuestionError('Could not obtain quiz');
    }
    setQuestionLoading(false);
  };

  useEffect(() => {
    fetchQuestion(token, quizid, questionid);
  }, [token, quizid, questionid]);

  return { question, questionLoading, questionError };
};

export default useQuestionFetch;
