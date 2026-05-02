export default function DashboardFilter({
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
  return (
    <div className="flex flex-row justify-between items-center bg-white p-3 rounded-xl w-full shadow-sm">
      <span>Page Filter</span>
      <div className="flex flex-row gap-2">
        <select
          name="month"
          id="month"
          className="border rounded-md p-1 bg-white border-gray-200 shadow-sm min-w-50"
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
          className="border rounded-md p-1 bg-white border-gray-200 shadow-sm min-w-50"
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
    </div>
  );
}
