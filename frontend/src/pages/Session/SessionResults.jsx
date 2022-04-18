import React, { useEffect, useState } from 'react';
import { Card, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../components/ContentWrapper';
import API from '../../utils/API';
import { useAuth } from '../../utils/Auth';
import useAdminStatus from '../../hooks/useAdminStatus';
import { BarChart, Cell, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const calculateTimeDiff = (start, end) => {
  const elapsed = +new Date(end) - +new Date(start);
  return +parseFloat(elapsed / 1000).toFixed(1);
}

const SessionResults = () => {
  const { sessionid } = useParams();
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { adminStatus } = useAdminStatus(token, sessionid);
  const [topFive, setTopFive] = useState([]);
  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);
  const [dataC, setDataC] = useState([]);
  const [dataCSelected, setDataCSelected] = useState(0);

  // Load Results on mount
  useEffect(() => {
    fetchResults(token, sessionid);
  }, []);

  // Set questions
  useEffect(() => {
    if (adminStatus) setQuestions(adminStatus.questions);
  }, [adminStatus]);

  // Set Top Five
  useEffect(() => {
    if (questions.length && results.length) {
      loadTopFive(questions, results);
      loadPercentageCorrect(questions, results);
      loadResponseTime(questions, results);
      loadQuestionBreakdown(dataCSelected, questions, results);
    }
  }, [questions, results]);

  // Fetch results from backend
  const fetchResults = async (token, sessionId) => {
    const data = await API.sessionResults(token, sessionId);
    if (data.error) {
      console.error(data.error);
    } else {
      setResults(data.results);
    }
  }

  // Extracts Top Five players data
  const loadTopFive = (questions, results) => {
    const playerPoints = [...results].map((player) => {
      const points = player.answers.reduce((sum, ans, idx2) => sum + (ans.correct ? questions[idx2].points : 0), 0);
      return { ...player, points };
    });
    const playersFive = playerPoints.sort((a, b) => b.points - a.points).slice(0, 5);
    setTopFive(playersFive);
  }

  // Extracts Percentage Correct data
  const loadPercentageCorrect = (questions, results) => {
    const data = questions.map((q, index) => {
      return {
        name: `Q${index + 1}`,
        'Percentage Correct': parseFloat(results.reduce((sum, p) => sum + +(p.answers[index].correct), 0) / results.length * 100).toFixed(2),
      }
    });
    setDataA(data);
  }

  // Extracts Response Time data
  const loadResponseTime = (questions, results) => {
    const data = questions.map((q, index) => {
      return {
        name: `Q${index + 1}`,
        'Average Response Time': parseFloat(results.reduce((sum, p) => sum + calculateTimeDiff(p.answers[index].questionStartedAt, p.answers[index].answeredAt), 0) / results.length).toFixed(1),
      }
    });
    setDataB(data);
  }

  // Extracts Question Breakdown data
  const loadQuestionBreakdown = (qIndex, questions, results) => {
    const questionCounter = questions[qIndex].options.map((q, i) => results.reduce((sum, res) => sum + (res.answers[qIndex].answerIds.includes(i) ? 1 : 0), 0));
    const data = questions[qIndex].options.map((q, index) => {
      return {
        name: String.fromCharCode(65 + index),
        Count: questionCounter[index],
        colour: (questions[qIndex].correct.includes(index) ? '#77DD77' : '#FF6961'),
      }
    });
    setDataC(data);
  }

  // Build Tooltip Label strings
  const buildTooltipLabel = (value, name, props) => {
    if (!questions.length) return '';
    const i = props.payload.name.charCodeAt(0) - 65;
    return [questions[dataCSelected].options[i], 'Option'];
  }

  // Handle Question Breakdown Change
  const handleQuestionBreakdownSelected = (event) => {
    setDataCSelected(+event);
    loadQuestionBreakdown(+event, questions, results);
  }

  return (
    <ContentWrapper>
      {/* Top 5 Table */}
      <Card className='mt-3 shadow'>
        <Card.Body>
          <Card.Title>Top Players</Card.Title>
          <Table responsive>
            <thead>
              <tr>
                <th>Player</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              { topFive.map((res, idx) => (
                <tr key={idx}>
                  <td>{res.name}</td>
                  <td>{res.points}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {/* Percentage Correct Chart */}
      <Card className='mt-2 shadow'>
        <Card.Body>
        <Card.Title>Percentage Correct</Card.Title>
        <div style={{ display: 'flex', minwidth: '100%', height: '15rem' }}>
          <ResponsiveContainer>
            <BarChart
              width={500}
              height={300}
              data={dataA}
              margin={{ top: 5, right: 20, left: -25, bottom: 0, }}
            >
              <Tooltip/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Bar dataKey='Percentage Correct' fill="#8884d8" unit='%' maxBarSize={50}/>
              <XAxis type='category' dataKey="name"/>
              <YAxis type='number' domain={[0, 100]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        </Card.Body>
      </Card>
      <Card className='mt-2'>
        <Card.Body>
        <Card.Title>Response Time</Card.Title>
        <div style={{ display: 'flex', minwidth: '100%', height: '10rem' }}>
          <ResponsiveContainer>
            <BarChart
              width={500}
              height={300}
              data={dataB}
              margin={{ top: 5, right: 20, left: -25, bottom: 0, }}
            >
              <Tooltip/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Bar dataKey='Average Response Time' fill="#8884d8" unit='s' maxBarSize={50}/>
              <XAxis type='category' dataKey="name"/>
              <YAxis type='number'/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        </Card.Body>
      </Card>
      {/* Question Breakdown Chart */}
      <Card className='mt-2 mb-3 shadow'>
        <Card.Body>
        <Card.Title className='d-flex justify-content-between'>
          Question Responses Breakdown
          <DropdownButton title={`Question ${dataCSelected + 1}`} onSelect={handleQuestionBreakdownSelected}>
            { questions.map((q, idx) => (
              <Dropdown.Item key={idx} eventKey={idx}>Question {idx + 1}</Dropdown.Item>
            ))}
          </DropdownButton>
        </Card.Title>
        <Card.Subtitle className='text-center'>Question: {questions && questions[dataCSelected].question}</Card.Subtitle>
        <div style={{ display: 'flex', minwidth: '100%', height: '10rem' }}>
          <ResponsiveContainer>
            <BarChart
              width={500}
              height={300}
              data={dataC}
              margin={{ top: 5, right: 20, left: -25, bottom: 0, }}
            >
              <Tooltip formatter={buildTooltipLabel}/>
              <CartesianGrid strokeDasharray='3 3'/>
              <Bar dataKey='Count' fill='#8884d8' unit='' maxBarSize={50}>
                { dataC.map((d, index) => (
                    <Cell key={`cell-${index}`} fill={d.colour} />
                ))}
              </Bar>
              <XAxis type='category' dataKey="name"/>
              <YAxis type='number'/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        </Card.Body>
      </Card>
    </ContentWrapper>
  )
}

export default SessionResults;
