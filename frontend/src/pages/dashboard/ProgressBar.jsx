export default function ProgressBar({ current, total, color = 'Teal' }) {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full bg-teal-500 transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
