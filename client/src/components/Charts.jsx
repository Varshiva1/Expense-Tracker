import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';

// 🔥 REQUIRED: prevents blank screen
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Charts = () => {
  const { stats } = useExpenses();

  const categoryLabels = stats?.byCategory?.map((c) => c.category) || [];
  const categoryValues = stats?.byCategory?.map((c) => c.total) || [];

  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: [
          '#6366F1',
          '#8B5CF6',
          '#EC4899',
          '#F59E0B',
          '#10B981',
        ],
        borderWidth: 0,
      },
    ],
  };

  const monthlyLabels = stats?.monthly?.map((m) => m.month) || [];
  const monthlyValues = stats?.monthly?.map((m) => m.total) || [];

  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyValues,
        backgroundColor: '#6366F1',
        borderRadius: 8,
      },
    ],
  };

  return (
    <section className="bg-white/95 backdrop-blur rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-semibold text-indigo-600 mb-8">
        Visualizations
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-sm text-gray-500 text-center mb-4">
            Expenses by Category
          </p>
          {categoryLabels.length ? (
            <Doughnut data={categoryData} />
          ) : (
            <p className="text-center text-gray-400 text-sm">
              No category data
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-sm text-gray-500 text-center mb-4">
            Monthly Expenses
          </p>
          {monthlyLabels.length ? (
            <Bar data={monthlyData} />
          ) : (
            <p className="text-center text-gray-400 text-sm">
              No monthly data
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Charts;
