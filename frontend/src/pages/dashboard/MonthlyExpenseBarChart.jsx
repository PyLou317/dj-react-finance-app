import Card from './Card';
import CardTitle from './CardTItle';
import NoDataAvailable from './NoDataAvailable';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  LogarithmicScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 1. You must register these for a Bar chart to work
// ChartJS.register(ArcElement, Title, Tooltip);
ChartJS.register(CategoryScale, LogarithmicScale, BarElement, Title, Tooltip);

export default function MonthlyExpenseBarChart({ data }) {
  const hasData = data && data.length > 0;

  const chartData = {
    // These appear on the legend and tooltips
    labels: data?.map((cat) => cat.name),
    datasets: [
      {
        label: 'Spending',
        data: data?.map((cat) => Math.abs(cat.category_sum)),
        backgroundColor: data?.map((cat) => cat.color || '#94a3b8'),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: 'logarithmic',
        beginAtZero: false,
        grid: {
          display: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    indexAxis: 'x',
    elements: {
      bar: {
        borderWidth: 2,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    },
  };

  return (
    <Card>
      <CardTitle name="Monthly Expense Chart" />
      {!hasData ? (
        <NoDataAvailable />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Card>
  );
}
