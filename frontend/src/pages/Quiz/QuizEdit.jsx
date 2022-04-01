import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const QuizEdit = () => {
  const { quizid } = useParams();
  console.log(quizid);

  // if (!quizid) {
  //   return (
  //     <Card>
  //       <Card.Body>
  //         <p>Invalid Quiz</p>
  //       </Card.Body>
  //     </Card>
  //   );
  // }

  return (
    <Container>
      <Card>
        <Card.Body>
          <p>Quiz: { quizid }</p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default QuizEdit;
