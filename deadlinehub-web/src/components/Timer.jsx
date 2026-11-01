import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Session Complete!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="mx-auto mt-12 max-w-md rounded-xl bg-white p-8 text-center shadow-lg border">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Study Focus</h2>
      <p className="mb-8 text-gray-500">Pomodoro Timer</p>
      
      <div className="mb-8 text-7xl font-mono font-bold text-blue-600">
        {minutes}:{seconds}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isActive ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Start</>}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 rounded-full bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300 transition"
        >
          <RotateCcw className="h-5 w-5" /> Reset
        </button>
      </div>
    </div>
  );
}