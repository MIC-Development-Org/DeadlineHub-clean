
import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Timer as TimerIcon,
  Clock
} from 'lucide-react';

export default function Timer({ onSessionComplete }) {
  const [mode, setMode] = useState('pomodoro');

  // Pomodoro states
  const [duration, setDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // Stopwatch states
  const [stopwatchTime, setStopwatchTime] = useState(0);

  const [isActive, setIsActive] = useState(false);

  const startedAt = useRef(null);
  const activeSince = useRef(null);
  const stopwatchElapsed = useRef(0);
  const completed = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (!isActive || mode !== 'pomodoro') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, mode]);

  // Stopwatch logic
  useEffect(() => {
    if (!isActive || mode !== 'stopwatch') return;

    const interval = setInterval(() => {
      const elapsed =
        stopwatchElapsed.current +
        Math.floor((Date.now() - activeSince.current) / 1000);

      setStopwatchTime(elapsed);
    }, 250);

    return () => clearInterval(interval);
  }, [isActive, mode]);

  // Pomodoro completion
  useEffect(() => {
    if (
      mode !== 'pomodoro' ||
      timeLeft !== 0 ||
      !startedAt.current ||
      completed.current
    ) return;

    completed.current = true;
    setIsActive(false);

    const session = {
      id: crypto.randomUUID(),
      type: 'pomodoro',
      durationMinutes: duration,
      durationSeconds: duration * 60,
      startedAt: startedAt.current,
      completedAt: new Date().toISOString()
    };

    onSessionComplete?.(session);

    alert('Pomodoro session completed!');
  }, [timeLeft, duration, mode, onSessionComplete]);

  // Start
  const startTimer = () => {
    if (mode === 'pomodoro') {
      if (timeLeft === 0) return;

      if (!startedAt.current) {
        startedAt.current = new Date().toISOString();
      }
    } else {
      activeSince.current = Date.now();

      if (!startedAt.current) {
        startedAt.current = new Date().toISOString();
      }
    }

    setIsActive(true);
  };

  // Pause
  const pauseTimer = () => {
    if (mode === 'stopwatch' && activeSince.current) {
      stopwatchElapsed.current += Math.floor(
        (Date.now() - activeSince.current) / 1000
      );

      setStopwatchTime(stopwatchElapsed.current);
      activeSince.current = null;
    }

    setIsActive(false);
  };

  // Reset
  const resetTimer = () => {
    setIsActive(false);

    setTimeLeft(duration * 60);
    setStopwatchTime(0);

    startedAt.current = null;
    activeSince.current = null;
    stopwatchElapsed.current = 0;
    completed.current = false;
  };

  // Change Pomodoro duration
  const changeDuration = (minutes) => {
    if (isActive || startedAt.current) return;

    const value = Number(minutes);

    if (!Number.isInteger(value) || value < 1 || value > 180) {
      alert('Choose a duration between 1 and 180 minutes.');
      return;
    }

    setDuration(value);
    setTimeLeft(value * 60);
    completed.current = false;
  };

  // Stop and save stopwatch session
  const stopStopwatch = () => {
    if (isActive) {
      pauseTimer();
    }

    const seconds = stopwatchElapsed.current;

    if (seconds <= 0) return;

    const session = {
      id: crypto.randomUUID(),
      type: 'stopwatch',
      durationSeconds: seconds,
      durationMinutes: Math.round(seconds / 60 * 100) / 100,
      startedAt: startedAt.current,
      completedAt: new Date().toISOString()
    };

    onSessionComplete?.(session);

    resetTimer();
  };

  // Switch modes only when no session is in progress
  const switchMode = (newMode) => {
    if (isActive || startedAt.current || stopwatchElapsed.current > 0) {
      return;
    }

    setMode(newMode);
    resetTimer();
  };

  // Formatting
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (mode === 'stopwatch') {
      return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(secs).padStart(2, '0')
      ].join(':');
    }

    return [
      String(minutes).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].join(':');
  };

  const displayTime =
    mode === 'pomodoro' ? timeLeft : stopwatchTime;

  return (
    <div className="mx-auto mt-12 max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg border">

      <h2 className="mb-2 text-2xl font-bold text-gray-800">
        Study Time Tracker
      </h2>

      <p className="mb-8 text-gray-500">
        Track your focus and study sessions
      </p>

      {/* Mode Selection */}
      <div className="flex justify-center gap-3 mb-8">

        <button
          onClick={() => switchMode('pomodoro')}
          disabled={isActive || startedAt.current !== null || stopwatchElapsed.current > 0}
          className={`flex items-center gap-2 rounded-lg px-5 py-3 font-semibold transition disabled:opacity-50 ${
            mode === 'pomodoro'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <TimerIcon className="h-5 w-5" />
          Pomodoro
        </button>

        <button
          onClick={() => switchMode('stopwatch')}
          disabled={isActive || startedAt.current !== null || stopwatchElapsed.current > 0}
          className={`flex items-center gap-2 rounded-lg px-5 py-3 font-semibold transition disabled:opacity-50 ${
            mode === 'stopwatch'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Clock className="h-5 w-5" />
          Stopwatch
        </button>

      </div>

      {/* Pomodoro Duration Selection */}
      {mode === 'pomodoro' && (
        <div className="mb-8">

          <p className="text-sm font-medium text-gray-600 mb-3">
            Choose focus duration
          </p>

          <div className="flex flex-wrap justify-center gap-2">

            {[15, 25, 30, 45, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => changeDuration(minutes)}
                disabled={isActive || startedAt.current !== null}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                  duration === minutes
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {minutes} min
              </button>
            ))}

          </div>

          <div className="flex justify-center items-center gap-2 mt-4">

            <input
              type="number"
              min="1"
              max="180"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              placeholder="Custom minutes"
              disabled={isActive || startedAt.current !== null}
              className="w-36 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => {
                changeDuration(customDuration);
                setCustomDuration('');
              }}
              disabled={isActive || startedAt.current !== null || !customDuration}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
            >
              Apply
            </button>

          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="mb-6">

        <p className="text-sm text-gray-500 mb-3">
          {mode === 'pomodoro' ? 'Focus Time' : 'Elapsed Study Time'}
        </p>

        <div className="text-6xl md:text-7xl font-mono font-bold text-blue-600">
          {formatTime(displayTime)}
        </div>

      </div>

      {/* Status */}
      <p className="text-sm text-gray-500 mb-8">
        {isActive
          ? 'Stay focused. Keep going!'
          : mode === 'pomodoro' && timeLeft === 0
          ? 'Session completed!'
          : 'Ready when you are.'}
      </p>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3">

        <button
          onClick={isActive ? pauseTimer : startTimer}
          disabled={!isActive && mode === 'pomodoro' && timeLeft === 0}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition disabled:opacity-50 ${
            isActive
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isActive
            ? <><Pause className="h-5 w-5" /> Pause</>
            : <><Play className="h-5 w-5" /> Start</>
          }
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-2 rounded-full bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300 transition"
        >
          <RotateCcw className="h-5 w-5" />
          Reset
        </button>

        {mode === 'stopwatch' && (
          <button
            onClick={stopStopwatch}
            disabled={stopwatchTime === 0 && !isActive}
            className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            <Square className="h-4 w-4" />
            Stop & Save
          </button>
        )}

      </div>

      <p className="mt-6 text-xs text-gray-400">
        {mode === 'pomodoro'
          ? 'Your session is recorded when the countdown finishes.'
          : 'Use Stop & Save to record your study time.'}
      </p>

    </div>
  );
}
