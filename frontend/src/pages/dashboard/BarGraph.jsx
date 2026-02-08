import { Bar } from 'react-chartjs-2';

export default function BarGraph({ data, options }) {
  return <Bar data={data} options={options} />;
}
