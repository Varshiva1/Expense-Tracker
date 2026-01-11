import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleModalToggle = (e) => {
      if (e.target.id === 'show-login') {
        setMode('login');
        setIsOpen(true);
        setFormData({ username: '', email: '', password: '' });
        setError('');
      } else if (e.target.id === 'show-register') {
        setMode('register');
        setIsOpen(true);
        setFormData({ username: '', email: '', password: '' });
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
      closeModal();
      setFormData({ username: '', email: '', password: '' });
    } else {
      setError(result.error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setError('');
    setFormData({ username: '', email: '', password: '' });
  };

  if (!isOpen) return null;

  return (
    <div id="auth-modal" className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={closeModal}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-5 pb-4 sm:p-6 relative">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none focus:outline-none"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mode === 'register' ? 'Register' : 'Login'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' ? (
                <>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Username</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Username/Email</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
              <button type="submit" className="btn btn-primary w-full">
                {mode === 'register' ? 'Register' : 'Login'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-primary-600 hover:underline"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setFormData({ username: '', email: '', password: '' });
                  setError('');
                }}
              >
                {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
