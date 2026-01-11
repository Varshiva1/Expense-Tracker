import Header from '../components/Header';
import AuthModal from '../components/AuthModal';
import ExpenseForm from '../components/ExpenseForm';
import Statistics from '../components/Statistics';
import Charts from '../components/Charts';
import Filters from '../components/Filters';
import ExpensesList from '../components/ExpensesList';
import { useAuth } from '../context/AuthContext';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-primary-700 p-5 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        <Header />
        <AuthModal />
        
        {isAuthenticated && (
          <main className="space-y-6">
            <ExpenseForm />
            <Statistics />
            <Charts />
            <Filters />
            <ExpensesList />
          </main>
        )}
      </div>
    </div>
  );
};

export default AppRouter;
