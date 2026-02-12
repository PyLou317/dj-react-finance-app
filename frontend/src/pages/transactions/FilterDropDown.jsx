import FilterWrapper from './FilterWrapper';
import { capitalize } from '../../utils/capitalizeFirstLetter';

export default function FilterDropDown({
  handleYearChange,
  yearFilter,
  setYearFilter,
  years,
  setMonthFilter,
  monthFilter,
  setCategoryFilter,
  categoryFilter,
  categoryData,
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
    <div className="mb-6">
      {/* Container Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-5">
          Filter Transactions
        </h3>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FilterWrapper
            name="year"
            selectOnChange={handleYearChange}
            selectValue={yearFilter}
            cancel={() => setYearFilter('')}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </FilterWrapper>

          <FilterWrapper
            name="month"
            selectOnChange={(e) => setMonthFilter(e.target.value)}
            selectValue={monthFilter}
            cancel={() => setMonthFilter('')}
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month} value={month.toLowerCase()}>
                {month}
              </option>
            ))}
          </FilterWrapper>

          <FilterWrapper
            name="category"
            selectOnChange={(e) => setCategoryFilter(e.target.value)}
            selectValue={categoryFilter}
            cancel={() => setCategoryFilter('')}
          >
            <option value="">All Categories</option>
            {categoryData?.map((cat) => (
              <option key={cat.id} value={cat?.id}>
                {cat?.parent
                  ? `${cat.parent.name}: ${capitalize(cat.name)}`
                  : cat.name}
              </option>
            ))}
          </FilterWrapper>
        </div>
      </div>
    </div>
  );
}
