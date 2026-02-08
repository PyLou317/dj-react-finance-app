import BarGraph from './BarGraph';
import Card from './Card';
import CardTitle from './CardTItle';
import NoDataAvailable from './NoDataAvailable';
import {
  Chart as ChartJS,
  ArcElement,
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

export default function MonthlyExpenseBarChart({
  data,
  handleMonthFilter,
  handleYearFilter,
  years,
  yearFilter,
  monthFilter,
}) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

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
          display: false, // Removing horizontal lines often makes it look cleaner
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: 'false',
      },
    },
    indexAxis: 'x',
    elements: {
      bar: {
        borderWidth: 2,
        // Fixed width in pixels or percentage of the category width
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    },
  };

  return (
    <Card>
      <CardTitle name="Monthly Expense Chart" />
      <div className="flex flex-row justify-end gap-2">
        <select
          name="month"
          id="month"
          className="border rounded-md p-1"
          onChange={handleMonthFilter}
          value={monthFilter.toLowerCase()}
        >
          {months.map((month) => (
            <option key={month} value={month.toLowerCase()}>
              {month}
            </option>
          ))}
        </select>
        <select
          name="year"
          id="year"
          className="border rounded-md p-1"
          onChange={handleYearFilter}
          value={yearFilter}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {!hasData ? (
        <NoDataAvailable />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Card>
  );
}
