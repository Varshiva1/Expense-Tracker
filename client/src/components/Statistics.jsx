import { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const step = value / (duration / 16);

    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  return <span>₹{display.toFixed(2)}</span>;
};

const Statistics = () => {
  const { stats } = useExpenses();

  return (
    <section className="bg-white/95 dark:bg-gray-900 rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-semibold text-primary-600 dark:text-indigo-400 mb-6">
        Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
          <p className="text-sm opacity-80">Total Expenses</p>
          <p className="text-3xl font-bold mt-2">
            <AnimatedNumber value={stats.total || 0} />
          </p>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <p className="text-sm opacity-80">This Month</p>
          <p className="text-3xl font-bold mt-2">
            <AnimatedNumber value={stats.thisMonth || stats.total || 0} />
          </p>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
