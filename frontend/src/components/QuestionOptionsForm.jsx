import React, { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// const AddAnswerButton = styled(Button)`
//  width: 100%;
//  background-color: transparent;
//  color: grey;
//  border: 1px dashed grey;
// `;

const QuestionOptionsForm = ({ questionType, setOptions, setCorrect, options, correct }) => {
  const [formOptions, setFormOptions] = useState(['', '', '', '', '', '']);
  const [formCorrect, setFormCorrect] = useState([]);

  // Update intermediate answers list from parent
  useEffect(() => {
    const newOptions = options.concat(Array(6).fill('')).slice(0, 6);
    setFormOptions(newOptions);
  }, [options]);

  // Update intermediate correct answer list from parent
  useEffect(() => {
    setFormCorrect(correct);
  }, [correct]);

  // Update Parent answers list
  useEffect(() => {
    setOptions(formOptions);
  }, [formOptions]);

  // Update Parent correct answer list
  useEffect(() => {
    setCorrect(formCorrect);
  }, [formCorrect]);

  // Answer updated handler
  const handleOptionsUpdated = (event, idx) => {
    setFormOptions(prev => {
      const newAns = [...prev];
      newAns[idx] = event.target.value;
      return newAns;
    });
  }

  const handleCorrectUpdated = (event, idx) => {
    if (questionType === 'single') {
      setFormCorrect(prev => {
        if (!prev.includes(idx)) return [idx];
      });
    } else if (questionType === 'multiple') {
      setFormCorrect(prev => {
        if (prev.includes(idx)) {
          return [...prev].filter(i => i !== idx);
        } else {
          const n = [...prev];
          n.push(idx);
          return n;
        }
      });
    }
  }

  // const handleAddAnswer = (event) => {
  //   event.preventDefault();
  //   setAnswers(prev => { console.log([...prev, '']); return [...prev, ''] });
  // }

  // const handleDeleteAnswer = (event) => {
  //   event.preventDefault();
  //   const idx = parseInt(event.currentTarget.id, 10) - 1;
  //   setAnswers(prev => {
  //     const n = prev;
  //     const del = n.splice(idx, 1);
  //     console.log(del);
  //     console.log(prev);
  //     console.log(idx);
  //     console.log(n);
  //     return n;
  //   });
  // }

  return (
    <Container fluid>
      <Row className='row-cols-2 row-cols-lg-6 g-2'>
        { formOptions.map((ans, idx) => (
          <Col key={idx}>
            <InputGroup>
              <Form.Control
                as='textarea'
                name={idx}
                isValid={formCorrect.includes(idx)}
                placeholder={`Answer ${idx + 1}${idx <= 1 ? '' : ' (optional)'}`}
                onChange={(e) => handleOptionsUpdated(e, idx)}
                value={ans}
              ></Form.Control>
              { questionType === 'single'
                ? <InputGroup.Radio
                    name='answerChoice'
                    onChange={(e) => handleCorrectUpdated(e, idx)}
                    checked={formCorrect.includes(idx)}
                    disabled={!formOptions[idx] && idx > 1}
                  ></InputGroup.Radio>
                : <InputGroup.Checkbox
                    name='answerChoices'
                    onChange={(e) => handleCorrectUpdated(e, idx)}
                    checked={formCorrect.includes(idx)}
                    disabled={!formOptions[idx] && idx > 1}
                  ></InputGroup.Checkbox>
              }
              {/* { idx > 1 &&
                <Button id={idx} variant='outline-danger' onClick={handleDeleteAnswer}><i className="bi bi-x-lg"></i></Button>
              } */}
            </InputGroup>
          </Col>
        ))}
        {/* { answers.length < 6 &&
          <Col>
            <AddAnswerButton variant='outline-secondary' onClick={handleAddAnswer}>Add answer</AddAnswerButton>
          </Col>
        } */}
      </Row>
    </Container>
  )
}

QuestionOptionsForm.propTypes = {
  questionType: PropTypes.string.isRequired,
  setOptions: PropTypes.func.isRequired,
  setCorrect: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  correct: PropTypes.array.isRequired,
}

export default QuestionOptionsForm;
