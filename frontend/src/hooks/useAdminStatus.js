import { useState, useEffect } from 'react';
import API from '../utils/API';

const defaultSession = {
  active: null,
  answerAvailable: null,
  isoTimeLastQuestionStarted: null,
  players: [],
  position: -1,
  questions: [],
}

const useAdminStatus = (token, sessionid) => {
  const [adminStatus, setAdminStatus] = useState(defaultSession);
  const [adminStatusLoading, setAdminStatusLoading] = useState(true);
  const [adminStatusError, setAdminStatusError] = useState('');

  const fetchAdminStatus = async (token, sessionid) => {
    const id = parseInt(sessionid, 10);
    try {
      setAdminStatusError('');
      setAdminStatusLoading(true);
      const data = await API.adminStatus(token, id);
      if (!data.error) setAdminStatus(data.results);
      else setAdminStatusError('Could not obtain session status');
    } catch (error) {
      setAdminStatusError('Could not obtain session status');
    }
    setAdminStatusLoading(false);
  };

  useEffect(() => {
    if (token && sessionid) fetchAdminStatus(token, sessionid);
  }, [token, sessionid]);

  return { adminStatus, adminStatusLoading, adminStatusError, fetchAdminStatus };
};

export default useAdminStatus;
