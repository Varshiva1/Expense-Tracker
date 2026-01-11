import { useExpenses } from '../context/ExpenseContext';

const Statistics = () => {
  const { stats } = useExpenses();

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthData = stats.monthly?.find((m) => m.month === thisMonth);
  const monthTotal = monthData ? monthData.total : 0;

  return (
    <section className="card">
      <h2 className="text-2xl font-bold text-primary-600 mb-6">Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-6 rounded-xl text-white text-center shadow-lg">
          <h3 className="text-base mb-3 opacity-90">Total Expenses</h3>
          <p className="text-3xl font-bold">${stats.total?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-6 rounded-xl text-white text-center shadow-lg">
          <h3 className="text-base mb-3 opacity-90">This Month</h3>
          <p className="text-3xl font-bold">${monthTotal.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
