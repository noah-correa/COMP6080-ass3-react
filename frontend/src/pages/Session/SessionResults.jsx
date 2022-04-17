import React, { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../components/ContentWrapper';
import API from '../../utils/API';
import { useAuth } from '../../utils/Auth';

const SessionResults = () => {
  const { sessionid } = useParams();
  const { token } = useAuth();
  const [results, setResults] = useState([]);

  // Load Results on mount
  useEffect(() => {
    fetchResults(token, sessionid);
  }, []);

  // Fetch results from backend
  const fetchResults = async (token, sessionId) => {
    const data = await API.sessionResults(token, sessionId);
    if (data.error) {
      console.error(data.error);
    } else {
      setResults(data.results);
      console.log(data.results);
    }
  }

  return (
    <ContentWrapper center>
      <Card>
        <Card.Body>
          <ListGroup>
            { results.map((result, idx) => (
              <ListGroup.Item key={idx}>
                <div>
                  <b>{result.name}</b>
                  <ListGroup variant='flush'>
                    { result.answers.map((answer, idx2) => (
                      <ListGroup.Item key={idx2}>
                        Question {idx2 + 1}: {answer.correct ? 'Correct' : 'Incorrect'}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </ContentWrapper>
  )
}

export default SessionResults;
