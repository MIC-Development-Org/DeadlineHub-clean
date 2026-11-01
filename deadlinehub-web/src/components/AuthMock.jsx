import { useState } from 'react';

export default function AuthMock({ onLogin }) {
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('user', name);
      onLogin(name);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">DeadlineHub Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter any name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 transition"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}