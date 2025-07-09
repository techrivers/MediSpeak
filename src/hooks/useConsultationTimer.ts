
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

const formatTimeInternal = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export function useConsultationTimer() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (!isRunning) {
      const now = new Date();
      // Adjust startTime to correctly resume from current elapsedTime
      // If elapsedTime is 0 (after a reset), it's a fresh start.
      setStartTime(new Date(now.getTime() - elapsedTime * 1000));
      setIsRunning(true);
    }
  }, [isRunning, elapsedTime]);

  const stopTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // When timer stops, elapsedTime is already up to date. Store it.
      localStorage.setItem('lastConsultationDuration', formatTimeInternal(elapsedTime));
    }
  }, [isRunning, elapsedTime]);

  const resetTimer = useCallback(() => {
    // If timer is running, stop it first. This will also save its final duration via stopTimer.
    if (isRunning) {
      stopTimer(); // This sets isRunning to false and saves duration
    }
    setStartTime(null);
    setElapsedTime(0); // Reset elapsed time for the next run
    setIsRunning(false); // Ensure isRunning is false after reset
    // We don't clear 'lastConsultationDuration' here immediately;
    // it holds the duration of the session that was just reset.
    // It will be overwritten by the next stopTimer or cleared if a new session starts and stops at 0.
  }, [isRunning, stopTimer]);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        // Calculate new elapsed time based on the original startTime and current time
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  return {
    elapsedTimeInSeconds: elapsedTime,
    formattedTime: formatTimeInternal(elapsedTime),
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
