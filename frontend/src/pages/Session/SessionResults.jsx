import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../utils/API';
import { useAuth } from '../../utils/Auth';

const SessionResults = () => {
  const { sessionid } = useParams();
  const { token } = useAuth();
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (sessionid) fetchResults(token, sessionid);
    console.log(results);
  }, [sessionid]);

  const fetchResults = async (token, sessionId) => {
    const data = await API.sessionResults(token, sessionId);
    if (data.error) {
      console.error(data.error);
    } else {
      setResults(data);
    }
  }

  return (
    <div>SessionResults</div>
  )
}

export default SessionResults;
