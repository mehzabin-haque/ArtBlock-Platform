import React, { useEffect, useState } from 'react';

type Props = {
  endTime: number; // End time in milliseconds since epoch
};

const Timer: React.FC<Props> = ({ endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(endTime - Date.now());

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTimeRemaining = endTime - Date.now();

      if (newTimeRemaining <= 0) {
        clearInterval(timerInterval);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(newTimeRemaining);
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [endTime]);

  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  const hours = Math.floor((timeRemaining / 1000 / 60 / 60) % 24);
  const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

  return (
    <div className="flex space-x-2">
      <div className="text-medium bg-blue-500 text-white p-2 rounded-md">{days}d</div>
      <div className="text-medium bg-green-500 text-white p-2 rounded-md">{hours}h</div>
      <div className="text-medium bg-yellow-500 text-white p-2 rounded-md">{minutes}m</div>
      <div className="text-md bg-red-500 text-white p-2 rounded-md">{seconds}s</div>
    </div>
  );
};

export default Timer;
