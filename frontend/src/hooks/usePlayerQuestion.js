import { useState, useEffect } from 'react';
import API from '../utils/API';

// const defaultQuestion = {
//   quizid: -1,
//   questionid: -1,
//   question: '',
//   type: 'single',
//   duration: 5,
//   points: 0,
//   media: {
//     type: 'url',
//     content: '',
//   },
//   answers: [],
//   answer: [],
// }

const usePlayerQuestion = (playerid) => {
  const [playerQuestion, setPlayerQuestion] = useState({});
  const [playerQuestionLoading, setPlayerQuestionLoading] = useState(true);
  const [playerQuestionError, setPlayerQuestionError] = useState('');

  const fetchPlayerQuestion = async (playerid) => {
    const id = parseInt(playerid, 10);
    try {
      setPlayerQuestionError('');
      setPlayerQuestionLoading(true);
      const data = await API.getPlayerQuestion(id);
      if (!data.error) {
        setPlayerQuestion(data.question);
        setPlayerQuestionLoading(false);
        return data.question;
      } else setPlayerQuestionError('Could not obtain player question');
    } catch (error) {
      setPlayerQuestionError('Could not obtain player question');
    }
    setPlayerQuestionLoading(false);
  };

  useEffect(() => {
    if (playerid) fetchPlayerQuestion(playerid);
  }, [playerid]);

  return { playerQuestion, playerQuestionLoading, playerQuestionError, fetchPlayerQuestion };
};

export default usePlayerQuestion;
