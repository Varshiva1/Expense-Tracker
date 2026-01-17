import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { login, register, isAuthenticated, loading } = useAuth();

  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 🔥 AUTO OPEN LOGIN WHEN NOT AUTHENTICATED
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setIsOpen(true);
      setMode('login');
    }
  }, [loading, isAuthenticated]);

  // keep header buttons working
  useEffect(() => {
    const handleModalToggle = (e) => {
      if (e.target.id === 'show-login') {
        setMode('login');
        setIsOpen(true);
        setError('');
      } else if (e.target.id === 'show-register') {
        setMode('register');
        setIsOpen(true);
        setError('');
      }
    };

    document.addEventListener('click', handleModalToggle);
    return () => document.removeEventListener('click', handleModalToggle);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (mode === 'register') {
      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }
      result = await register(formData.username, formData.email, formData.password);
    } else {
      if (!formData.username || !formData.password) {
        setError('Username and password are required');
        return;
      }
      result = await login(formData.username, formData.password);
    }

    if (result.success) {
      setIsOpen(false);          // 🔥 close modal after login
      setFormData({ username: '', email: '', password: '' });
      setError('');
    } else {
      setError(result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="auth-modal" className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>

        <div className="relative bg-white rounded-xl shadow-xl sm:max-w-lg sm:w-full p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {mode === 'register' ? 'Register' : 'Login'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </>
            )}

            {mode === 'login' && (
              <input
                type="text"
                placeholder="Username / Email"
                className="w-full px-4 py-2 border-2 rounded-lg"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            )}

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border-2 rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" className="btn btn-primary w-full">
              {mode === 'register' ? 'Register' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              className="text-primary-600 hover:underline"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login'
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
