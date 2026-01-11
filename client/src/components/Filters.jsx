import { useExpenses } from '../context/ExpenseContext';

const Filters = () => {
  const { filters, setFilters, loadExpenses, loadStats } = useExpenses();

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    loadExpenses();
    loadStats();
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', category: '' });
  };

  return (
    <section className="card">
      <h2 className="text-2xl font-bold text-primary-600 mb-6">Filters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="form-group">
          <label htmlFor="filter-start-date">Start Date</label>
          <input
            type="date"
            id="filter-start-date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="filter-end-date">End Date</label>
          <input
            type="date"
            id="filter-end-date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
          </select>
        </div>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <button className="btn btn-primary flex-1" onClick={applyFilters}>
            Apply
          </button>
          <button className="btn btn-secondary flex-1" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>
    </section>
  );
};

export default Filters;
