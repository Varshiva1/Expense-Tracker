import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur rounded-2xl shadow-sm mb-10 px-8 py-5 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-indigo-600">
        💰 Expense Tracker
      </h1>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            👋 {user?.username || user?.email}
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
