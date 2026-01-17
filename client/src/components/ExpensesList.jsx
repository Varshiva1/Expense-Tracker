import { useExpenses } from '../context/ExpenseContext';

const ExpensesList = () => {
  const { expenses, deleteExpense, setEditingExpense } = useExpenses();

  if (expenses.length === 0) {
    return (
      <section className="bg-white/95 dark:bg-gray-900 rounded-2xl shadow-lg p-10 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          No expenses yet
        </h3>
        <p className="text-sm text-gray-500">
          Start by adding your first expense above
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white/95 dark:bg-gray-900 rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-semibold text-primary-600 dark:text-indigo-400 mb-6">
        Expenses
      </h2>

      <div className="space-y-4">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="flex flex-col sm:flex-row justify-between gap-4 p-5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow transition border-l-4 border-primary-500"
          >
            <div>
              <h4 className="font-semibold">{e.description}</h4>
              <p className="text-sm text-gray-500">
                {e.category} • {new Date(e.date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-red-500">
                ₹{parseFloat(e.amount).toFixed(2)}
              </div>
              <button
                className="btn btn-secondary btn-small"
                onClick={() => setEditingExpense(e)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-small"
                onClick={() => deleteExpense(e.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpensesList;
