import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white rounded-xl shadow-lg mb-8 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 className="text-3xl font-bold text-primary-600">💰 Expense Tracker</h1>
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <div id="auth-buttons" className="flex gap-3">
            <button id="show-login" className="btn btn-primary">
              Login
            </button>
            <button id="show-register" className="btn btn-secondary">
              Register
            </button>
          </div>
        ) : (
          <div id="user-info" className="flex items-center gap-4">
            <span id="username-display" className="font-semibold text-primary-600">
              {user?.username}
            </span>
            <button id="logout-btn" className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
