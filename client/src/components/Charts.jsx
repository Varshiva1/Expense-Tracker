import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Charts = () => {
  const { stats } = useExpenses();

  const categoryData = {
    labels: stats.byCategory?.map((c) => c.category) || [],
    datasets: [
      {
        data: stats.byCategory?.map((c) => c.total) || [],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#00f2fe',
          '#43e97b',
          '#fa709a',
          '#fee140',
        ],
      },
    ],
  };

  const sortedMonthly = [...(stats.monthly || [])].reverse();
  const monthlyData = {
    labels: sortedMonthly.map((m) => m.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: sortedMonthly.map((m) => m.total),
        backgroundColor: '#667eea',
      },
    ],
  };

  return (
    <section className="card">
      <h2 className="text-2xl font-bold text-primary-600 mb-6">Visualizations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-primary-600 mb-4 text-center">
            Expenses by Category
          </h3>
          <Doughnut
            data={categoryData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
        <div className="bg-gray-50 p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-primary-600 mb-4 text-center">
            Monthly Expenses
          </h3>
          <Bar
            data={monthlyData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Charts;
