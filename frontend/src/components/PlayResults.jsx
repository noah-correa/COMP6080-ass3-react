import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

const CorrectIcon = styled(HiOutlineCheckCircle)`
  color: limegreen;
`;

const IncorrectIcon = styled(HiOutlineXCircle)`
  color: red;
`;

const PlayResults = ({ results, questions }) => {
  useEffect(() => {
    console.log(results);
  }, [results]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  return (
    <ListGroup as='ol' numbered>
      { questions.length !== 0 && results.length !== 0 &&
        <>
          <ListGroup.Item className='text-center fw-bold'>Total Points: {questions.reduce((sum, q, i) => sum + (results[i] && results[i].correct ? q.points : 0), 0)}</ListGroup.Item>
          { results.map((result, idx) => (
            <ListGroup.Item as='li' className='d-flex justify-content-between align-items-start' key={idx}>
            <div className="ms-2 me-auto">
              <div className="fw-bold">{questions[idx].question}</div>
            </div>
            <div>
              {questions[idx].points} pts {result.correct ? <CorrectIcon size='1.5rem'/> : <IncorrectIcon size='1.5rem'/>}
            </div>
            </ListGroup.Item>
          ))}
        </>
      }
    </ListGroup>
  )
}

PlayResults.propTypes = {
  results: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
}

export default PlayResults;
