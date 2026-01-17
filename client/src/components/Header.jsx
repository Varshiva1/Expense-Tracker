import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white rounded-xl shadow-lg mb-8 p-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-primary-600">
        💰 Expense Tracker
      </h1>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-primary-600">
            {user?.username}
          </span>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
