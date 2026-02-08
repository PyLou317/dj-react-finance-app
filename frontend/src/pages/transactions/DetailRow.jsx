export default function DetailRow({
  icon,
  label,
  value,
  valueClass = 'text-gray-900',
}) {
  let displayValue = '';
  if (value == false) {
    displayValue = 'Posted';
  } else if (value == true) {
    displayValue = 'Pending';
  } else {
    displayValue = value;
  }

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0 border-gray-50">
      <div className="flex items-center gap-3 text-gray-500">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={`text-sm ${valueClass}`}>{displayValue}</span>
    </div>
  );
}
