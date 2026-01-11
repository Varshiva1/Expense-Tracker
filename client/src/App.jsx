import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import AppRouter from './router/AppRouter';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppRouter />
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
