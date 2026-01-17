import { useExpenses } from '../context/ExpenseContext';

const Filters = () => {
  const { expenses, filters, setFilters, loadExpenses, loadStats } = useExpenses();

  // 🔥 derive unique categories from expenses
  const categories = Array.from(
    new Set(expenses.map((e) => e.category))
  );

  const handleApply = () => {
    loadExpenses(filters);
    loadStats(filters);
  };

  const handleClear = () => {
    const cleared = { startDate: '', endDate: '', category: '' };
    setFilters(cleared);
    loadExpenses(cleared);
    loadStats(cleared);
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filters
      </h2>

      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Start Date */}
        <input
          type="date"
          className="input flex-1"
          value={filters.startDate || ''}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        {/* End Date */}
        <input
          type="date"
          className="input flex-1"
          value={filters.endDate || ''}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />

        {/* Category */}
        <select
          className="input flex-1"
          value={filters.category || ''}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium"
          onClick={handleApply}
        >
          Apply
        </button>

        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    </section>
  );
};

export default Filters;
