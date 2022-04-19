import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import Loading from '../components/Loading';
import OptionButton from '../components/OptionButton';

export const OptionsContainer = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 5px 5px;
`;

const QuizOptions = ({ questionType, options, updateSelected, disabled, correct }) => {
  const [selected, setSelected] = useState([]);

  // Reset selected if options change
  useEffect(() => {
    setSelected([]);
  }, [options]);

  // Call parent onChange when answers are changed
  useEffect(() => {
    if (selected) updateSelected(selected);
  }, [selected])

  const handleChangeSelected = (event, idx) => {
    event.preventDefault();
    if (questionType === 'single') {
      setSelected([idx]);
    } else if (questionType === 'multiple') {
      setSelected(prev => {
        const n = [...prev];
        if (n.includes(idx)) {
          if (n.length === 1) return n;
          return n.filter(i => i !== idx);
        } else {
          n.push(idx);
          return n;
        }
      });
    }
  }

  if (disabled && correct.length === 0) return <Loading variant='dark'/>

  return (
    <>
      <OptionsContainer fluid>
        { options && options.map((option, idx) => (
          <OptionButton
            key={idx}
            index={idx}
            handleClick={(e) => handleChangeSelected(e, idx)}
            selected={selected && selected.includes(idx)}
            correct={correct && correct.includes(idx)}
            questionType={questionType}
            disabled={disabled}
            question={option}
          >
          </OptionButton>
        ))
        }
      </OptionsContainer>
    </>
  )
}

QuizOptions.propTypes = {
  questionType: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  updateSelected: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  correct: PropTypes.array.isRequired,
}

export default QuizOptions;
