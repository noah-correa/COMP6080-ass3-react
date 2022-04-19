import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';

const calculateTimeLeft = (start, duration) => {
  const elapsed = +new Date() - +new Date(start);
  const secondsLeft = Math.floor(duration - (elapsed / 1000));
  if (secondsLeft <= 0) return 0;
  else return secondsLeft;
}

const CountdownTimer = ({ timer, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const interval = useRef();

  // Update time left with new time
  const updateTimeLeft = (start, duration) => {
    const t = calculateTimeLeft(start, duration);
    setTimeLeft(t);
    if (t === 0) {
      setStarted(false);
    }
  }

  // Start countdown Interval
  useEffect(() => {
    if (started) {
      interval.current = setInterval(() => {
        if (timeLeft > 0) updateTimeLeft(timer.start, timer.duration);
      }, 1000);
    } else {
      onEnd();
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [started]);

  // Reset countdown if start time or duration changed
  useEffect(() => {
    if (timer) {
      setStarted(true);
      updateTimeLeft(timer.start, timer.duration);
    }
  }, [timer]);

  return (
    <>
      { timeLeft > 0
        ? <ProgressBar label={timeLeft} now={100 - (timer.duration - timeLeft) / timer.duration * 100} variant={timeLeft <= 5 ? 'warning' : 'primary'}/>
        : <ProgressBar label='0' now='100' variant='danger'/>
      }
    </>
  )
}

CountdownTimer.propTypes = {
  timer: PropTypes.object,
  onEnd: PropTypes.func,
}

export default CountdownTimer;
