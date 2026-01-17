import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // login | register
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (mode === 'login') {
      result = await login(formData.username, formData.password);
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      result = await register(
        formData.username,
        formData.email,
        formData.password
      );
    }

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A4DA2] flex items-center justify-center px-4">


      <div className="absolute inset-0">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-transparent to-indigo-900/50"></div>
      </div>

     
      <div className="relative z-10 w-full max-w-md bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/20">

     
        <h1 className="text-[40px] font-extrabold text-white text-center mb-3 tracking-tight">
          💰 Expense Tracker
        </h1>
        <p className="text-blue-100 text-center mb-10 text-base">
          {mode === 'login'
            ? 'Login to manage your expenses smarter'
            : 'Create an account to start tracking'}
        </p>

       
        <form onSubmit={handleSubmit} className="space-y-6">

          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Username"
                className="input"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </>
          )}

          {mode === 'login' && (
            <input
              type="text"
              placeholder="Username or Email"
              className="input"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          )}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input pr-12"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm hover:text-gray-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0A3D91] hover:bg-[#08357d] text-white font-semibold text-lg transition shadow-lg disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign in'
              : 'Register'}
          </button>
        </form>

     
        <div className="mt-8 text-center text-blue-100 text-sm">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-white underline font-semibold"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-white underline font-semibold"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

  
      <style>{`
        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.9);
          color: #1f2937;
          font-size: 15px;
          outline: none;
        }

        .input:focus {
          box-shadow: 0 0 0 2px #3b82f6;
        }

        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.35;
          animation: float 18s ease-in-out infinite;
        }

        .blob-1 {
          width: 280px;
          height: 280px;
          background: #38bdf8;
          top: 10%;
          left: 10%;
        }

        .blob-2 {
          width: 360px;
          height: 360px;
          background: #818cf8;
          bottom: 15%;
          right: 15%;
          animation-delay: -6s;
        }

        .blob-3 {
          width: 220px;
          height: 220px;
          background: #60a5fa;
          top: 40%;
          left: 60%;
          animation-delay: -12s;
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
