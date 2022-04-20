import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Stack } from 'react-bootstrap';
import { CorrectIcon, IncorrectIcon } from '../styles/common';

export const OptionButtonWrapper = styled(Button)`
  min-width: 35%;
  max-width: 240px;
  min-height: 3vw;
  flex: 1;
  text-align: left;
`;

export const ButtonContent = styled(Stack)`
  display: flex;
  align-items: center;
  height: 100%;
  & :first-child {
    width: 12px;
  };
`;

const OptionButton = ({ index, questionType, selected, correct, disabled, handleClick, question }) => {
  // Get correct variant of button
  const getButtonVariant = (disabled, selected, correct) => {
    if (disabled && selected && correct) return 'success';
    if (disabled && selected && !correct) return 'danger';
    if (disabled && !selected && correct) return 'outline-danger';
    return 'outline-secondary';
  }

  // Convert key to letter
  const keyToLetter = (key) => {
    return String.fromCharCode(65 + key);
  }

  return (
    <OptionButtonWrapper
      type={questionType === 'single' ? 'radio' : 'checkbox'}
      variant={getButtonVariant(disabled, selected, correct)}
      active={selected}
      disabled={disabled}
      onClick={handleClick}
    >
      <ButtonContent direction='horizontal'>
        <div className='me-2'>
          {keyToLetter(index)}
        </div>
        <div className='vr'></div>
        <div className='ms-2'>{question}</div>
        {/* <div className=''> */}
          { disabled && correct &&
            <CorrectIcon className='ms-auto' size='1.5rem'/>
          }
          { disabled && selected && !correct &&
            <IncorrectIcon className='ms-auto' size='1.5rem'/>
          }
        {/* </div> */}
      </ButtonContent>
    </OptionButtonWrapper>
  )
}

OptionButton.propTypes = {
  index: PropTypes.number.isRequired,
  questionType: PropTypes.oneOf(['single', 'multiple']).isRequired,
  selected: PropTypes.bool.isRequired,
  correct: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
}

export default OptionButton;
