import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDonutChart({ categories }) {
  const chartColors = [
    '#0D9488', // Teal-600 (Matches app accent)
    '#0891B2', // Cyan-600 (Complementary)
    '#475569', // Slate-600 (Neutral)
    '#64748B', // Slate-500 (Neutral)
    '#94A3B8', // Slate-400 (Neutral)
    '#B91C1C', // Red-700 (Muted for expenses)
    '#C2410C', // Orange-700 (Muted for expenses)
    '#15803D', // Green-700 (Muted for income)
    '#BE185D', // Pink-700 (Distinct accent)
    '#6D28D9', // Violet-700 (Distinct accent)
  ];
  const chartData = {
    // These appear on the legend and tooltips
    labels: categories?.map((cat) => cat.name),
    datasets: [
      {
        label: 'Spending',
        data: categories?.map((cat) => Math.abs(cat.category_sum)),
        backgroundColor: chartColors?.map((color) => color || '#94a3b8'),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return <Doughnut data={chartData} options={options} />;
}
