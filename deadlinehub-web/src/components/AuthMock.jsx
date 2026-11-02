
import { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
  Heart,
  HelpCircle
} from 'lucide-react';

export default function AuthMock({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignup && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isSignup && password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    // Mock authentication: this does not verify real credentials.
    const username = isSignup
      ? name.trim()
      : email.split('@')[0];

    localStorage.setItem('user', username);
    localStorage.setItem('userId', 'demo-user-123');

    onLogin(username);
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#f7f7fc] flex flex-col">

      {/* Header */}
      
      <header className="flex items-center justify-between px-6 md:px-10 py-4">
        <div className="flex items-center gap-2">
          <div className="relative bg-[#493bb0] text-white p-2 rounded-lg">
            <CalendarDays size={20} />
            <CheckCircle2
              size={12}
              className="absolute -bottom-1 -right-1 bg-white text-[#493bb0] rounded-full"
            />
          </div>
          <span className="font-bold text-[#252543] tracking-tight">
            DeadlineHub
          </span>
        </div>
        
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <HelpCircle size={13} />
          Need a hand?
          <span className="text-[#493bb0] font-semibold cursor-pointer">
            Get help
          </span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex items-center justify-center px-5 py-5">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left Information Panel */}
          <section className="hidden lg:flex bg-[#eceafd] rounded-2xl p-10 min-h-[620px] flex-col justify-between relative overflow-hidden">

            <div>
              <p className="text-[10px] tracking-[2px] text-[#493bb0] font-bold mb-5">
                ━ YOUR SEMESTER, SIMPLIFIED
              </p>

              <h1 className="text-4xl font-normal leading-tight text-[#302c82] max-w-sm">
                {isSignup
                  ? 'Make room for what matters.'
                  : 'Less juggling. More living.'}
              </h1>

              <p className="text-sm text-gray-500 mt-4 max-w-sm leading-6">
                From assignments to club plans, bring your busy student
                life into one calmer space.
              </p>
            </div>

            {/* Decorative Calendar */}
            <div className="relative mt-8">

              <div className="bg-white rounded-2xl shadow-lg p-5 w-72 relative z-10">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <CalendarDays size={14} className="text-[#493bb0]" />
                    October 2026
                  </div>
                  <div className="flex gap-3 text-gray-500">
                    <ChevronLeft size={14} />
                    <ChevronRight size={14} />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[9px] text-gray-400 mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <span key={i}>{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
                  {Array.from({ length: 21 }, (_, i) => i + 12).map((day) => (
                    <span
                      key={day}
                      className={`p-2 rounded-md ${
                        day === 14
                          ? 'bg-[#493bb0] text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {day <= 31 ? day : ''}
                    </span>
                  ))}
                </div>

                <p className="text-[9px] text-green-600 mt-4">
                  ● A clear week. A clearer head.
                </p>
              </div>

              {/* Decorative Task Card */}
              <div className="bg-white rounded-xl shadow-lg p-4 absolute -bottom-12 right-0 w-64 z-20">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-[#493bb0] font-bold">
                    ◈ ACADEMICS
                  </span>
                  <span className="bg-red-50 text-red-500 px-2 py-1 rounded text-[8px]">
                    High priority
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-2">
                  Literature essay
                </p>
                <p className="text-[9px] text-gray-400 mt-2">
                  ◷ Today, 11:59 PM
                </p>
              </div>

              <div className="bg-white rounded-full shadow-sm p-3 absolute bottom-[-30px] left-[-10px] z-20 flex items-center gap-2 text-[9px]">
                <CheckCircle2 size={14} className="text-green-500" />
                Club meeting? All set.
              </div>
            </div>

            <div className="mt-20">
              <p className="text-xs text-[#302c82] font-semibold mb-3">
                Different parts of life. One place to plan.
              </p>

              <div className="flex gap-2">
                <span className="bg-white rounded-full px-3 py-2 text-[10px] flex gap-1">
                  <BookOpen size={12} /> Classes
                </span>
                <span className="bg-white rounded-full px-3 py-2 text-[10px] flex gap-1">
                  <Users size={12} /> Clubs
                </span>
                <span className="bg-white rounded-full px-3 py-2 text-[10px] flex gap-1">
                  <Heart size={12} /> Life
                </span>
              </div>
            </div>
          </section>

          {/* Authentication Form */}
          <section className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9">

            <p className="text-[9px] tracking-[2px] text-[#493bb0] font-bold mb-2">
              {isSignup ? 'LESS CHAOS. MORE YOU.' : 'YOUR NEXT CHAPTER STARTS HERE'}
            </p>

            <h2 className="text-2xl font-bold text-[#292943]">
              {isSignup ? 'Create your account' : 'Welcome back!'}
            </h2>

            <p className="text-xs text-gray-400 mt-2 mb-7">
              {isSignup
                ? 'One place for everything on your plate.'
                : 'Your deadlines, organized in one place.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {isSignup && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your first and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 text-xs outline-none focus:border-[#493bb0] focus:ring-1 focus:ring-[#493bb0]"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-[#493bb0]">
                  <Mail size={15} className="text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-[#493bb0]">
                  <LockKeyhole size={15} className="text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isSignup ? 'Create a password' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 text-xs outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {isSignup && (
                  <p className="text-[10px] text-gray-400 mt-2">
                    Use at least 8 characters.
                  </p>
                )}
              </div>

              {isSignup && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-[#493bb0]">
                    <LockKeyhole size={15} className="text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-3 text-xs outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {!isSignup && (
                <div className="flex justify-between items-center text-[10px]">
                  <label className="flex gap-2 items-center text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-[#493bb0]"
                    />
                    Remember me
                  </label>
                  <button type="button" className="text-[#493bb0] font-semibold">
                    Forgot password?
                  </button>
                </div>
              )}

              {isSignup && (
                <label className="flex gap-2 items-start text-[10px] text-gray-500">
                  <input type="checkbox" required className="accent-[#493bb0] mt-0.5" />
                  I agree to the Terms of Service and Privacy Policy.
                </label>
              )}

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#493bb0] hover:bg-[#392d91] text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                {isSignup ? 'Create Account' : 'Log In'}
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-[10px] text-gray-400">or</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <button
              type="button"
              className="w-full border border-gray-200 rounded-lg py-3 text-xs text-gray-600 hover:bg-gray-50 transition"
            >
              🌐 &nbsp; Continue with Google
            </button>

            <p className="text-center text-[10px] text-gray-400 mt-6">
              {isSignup
                ? 'Already have an account?'
                : "New to DeadlineHub?"}
              <button
                type="button"
                onClick={switchMode}
                className="text-[#493bb0] font-semibold ml-1"
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between px-6 md:px-10 py-4 text-[9px] text-gray-400">
        <span>© 2026 DeadlineHub. A little more in control.</span>
        <div className="flex gap-5">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}