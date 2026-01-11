import { useExpenses } from '../context/ExpenseContext';

const ExpensesList = () => {
  const { expenses, deleteExpense, setEditingExpense } = useExpenses();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense); // 🔥 send data to form
    document.querySelector('.card')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (expenses.length === 0) {
    return (
      <section className="card">
        <h2 className="text-2xl font-bold text-primary-600 mb-6">Expenses</h2>
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No expenses found. Add your first expense above!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="text-2xl font-bold text-primary-600 mb-6">Expenses</h2>
      <div className="max-h-[500px] overflow-y-auto space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-l-4 border-primary-500 hover:shadow-md hover:translate-x-1 transition-all duration-200"
          >
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {expense.description}
              </h4>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  <strong className="font-semibold">Category:</strong>{' '}
                  {expense.category}
                </span>
                <span>
                  <strong className="font-semibold">Date:</strong>{' '}
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-red-600">
                ${parseFloat(expense.amount).toFixed(2)}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => handleEdit(expense)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpensesList;
