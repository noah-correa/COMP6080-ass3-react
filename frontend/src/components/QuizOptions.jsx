import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Container } from 'react-bootstrap';
import styled from 'styled-components';
import Loading from '../components/Loading';

const OptionsContainer = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 5px 5px;
`;

const OptionButton = styled(Button)`
  min-width: 45%;
  height: 10%;
  flex: 1;
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

  const getButtonVariant = (idx, correct) => {
    if (disabled && selected.includes(idx) && correct.includes(idx)) return 'success';
    if (disabled && selected.includes(idx) && !correct.includes(idx)) return 'danger';
    if (disabled && !selected.includes(idx) && correct.includes(idx)) return 'danger';
    return 'outline-secondary';
  }

  if (disabled && correct.length === 0) return <Loading variant='dark'/>

  return (
    <>
      <OptionsContainer fluid>
        { options && options.map((option, idx) => (
          <OptionButton
            variant={getButtonVariant(idx, correct)}
            key={idx}
            onClick={(e) => handleChangeSelected(e, idx)}
            active={selected && selected.includes(idx)}
            type={questionType === 'single' ? 'radio' : 'checkbox'}
            disabled={disabled}
          >
            {option}
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
