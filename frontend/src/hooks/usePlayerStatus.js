import { useState, useEffect } from 'react';
import API from '../utils/API';

const usePlayerStatus = (playerid) => {
  const [playerStatus, setPlayerStatus] = useState({ started: false });
  const [playerStatusLoading, setPlayerStatusLoading] = useState(true);
  const [playerStatusError, setPlayerStatusError] = useState('');

  const fetchPlayerStatus = async (playerid) => {
    const id = parseInt(playerid, 10);
    try {
      setPlayerStatusError('');
      setPlayerStatusLoading(true);
      const data = await API.playerStatus(id);
      if (!data.error) {
        setPlayerStatus(data);
        setPlayerStatusLoading(false);
        return data;
      } else setPlayerStatusError('Could not obtain session status');
    } catch (error) {
      setPlayerStatusError('Could not obtain session status');
    }
    setPlayerStatusLoading(false);
  };

  useEffect(() => {
    if (playerid) fetchPlayerStatus(playerid);
  }, [playerid]);

  return { playerStatus, playerStatusLoading, playerStatusError, fetchPlayerStatus };
};

export default usePlayerStatus;
