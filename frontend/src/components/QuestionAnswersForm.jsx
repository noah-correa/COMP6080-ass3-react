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

const QuestionAnswersForm = ({ questionType, setAnswersList, setAnswer, answersList, answer }) => {
  const [answers, setAnswers] = useState(['', '', '', '', '', '']);
  const [valid, setValid] = useState([false, false, false, false, false, false]);

  // Update intermediate answers list
  useEffect(() => {
    const newAnswers = answersList.concat(Array(6).fill('')).slice(0, 6);
    setAnswers(newAnswers);
  }, [answersList]);

  // Update intermediate correct answer list
  useEffect(() => {
    const newValid = answer.concat(Array(6).fill(false)).slice(0, 6);
    setValid(newValid);
  }, [answer]);

  // Update Parent answers list
  useEffect(() => {
    setAnswersList(answers);
  }, [answers]);

  // Update Parent correct answer list
  useEffect(() => {
    setAnswer(valid);
  }, [valid]);

  // Answer updated handler
  const handleAnswerUpdated = (event, idx) => {
    setAnswers(prev => {
      const newAns = [...prev];
      newAns[idx] = event.target.value;
      return newAns;
    });
  }

  const handleValidUpdated = (event, idx) => {
    if (questionType === 'single') {
      const newValid = new Array(6).fill(false);
      newValid[idx] = true;
      setValid(newValid);
    } else if (questionType === 'multiple') {
      const newValid = valid.map((val, index) => index === idx ? !val : val);
      setValid(newValid);
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
        { answers.map((ans, idx) => (
          <Col key={idx}>
            <InputGroup>
              <Form.Control
                as='textarea'
                name={idx}
                isValid={valid[idx]}
                placeholder={`Answer ${idx + 1}${idx <= 1 ? '' : ' (optional)'}`}
                onChange={(e) => handleAnswerUpdated(e, idx)}
                value={ans}
              ></Form.Control>
              { questionType === 'single'
                ? <InputGroup.Radio
                    name='answerChoice'
                    onChange={(e) => handleValidUpdated(e, idx)}
                    checked={valid[idx]}
                    disabled={!answers[idx] && idx > 1}
                  ></InputGroup.Radio>
                : <InputGroup.Checkbox
                    name='answerChoices'
                    onChange={(e) => handleValidUpdated(e, idx)}
                    checked={valid[idx]}
                    disabled={!answers[idx] && idx > 1}
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

QuestionAnswersForm.propTypes = {
  questionType: PropTypes.string.isRequired,
  setAnswersList: PropTypes.func.isRequired,
  setAnswer: PropTypes.func.isRequired,
  answersList: PropTypes.array.isRequired,
  answer: PropTypes.array.isRequired,
}

export default QuestionAnswersForm;
