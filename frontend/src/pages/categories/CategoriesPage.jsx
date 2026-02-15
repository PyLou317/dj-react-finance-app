import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Outlet, useParams } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCategoryTotals } from '../../api/categories';
import MainTitle from '../../components/MainTitle';
import CategoryRow from '../dashboard/categoryRow';
import FilterWrapper from '../transactions/FilterWrapper';
import FilterComponent from '../transactions/FilterComponent';
import CategoryDonutChart from './CategoriesDonutChart';

export default function CategoriesPage() {
  const [openFilters, setOpenFilters] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const { categoryId } = useParams();
  const { getToken } = useAuth();

  const { isPending: categoryTotalsIsPending, data: categoryTotals } = useQuery(
    {
      queryKey: ['categoryTotals', yearFilter, monthFilter],
      queryFn: async () => {
        const token = await getToken();
        return fetchCategoryTotals(token, monthFilter, yearFilter);
      },
      placeholderData: keepPreviousData,
    },
  );

  const today = new Date();
  const year = today.getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => year - i);

  function clearFilters() {
    setYearFilter('');
    setMonthFilter('');
  }

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
    <div>
      {categoryId ? (
        <Outlet />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <MainTitle name="Category Breakdown" />
              <FilterComponent
                openFilters={openFilters}
                clearFilters={clearFilters}
                setOpenFilters={setOpenFilters}
              />
            </div>

            {/* Filter Dropdown Panel */}
            {openFilters && (
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FilterWrapper
                  name="year"
                  selectOnChange={(e) => setYearFilter(e.target.value)}
                  selectValue={yearFilter}
                  cancel={() => setYearFilter('')}
                >
                  <option value="">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </FilterWrapper>

                <FilterWrapper
                  name="month"
                  selectOnChange={(e) => setMonthFilter(e.target.value)}
                  selectValue={monthFilter}
                  cancel={() => setMonthFilter('')}
                  value={monthFilter.toLowerCase()}
                >
                  <option value="">All Months</option>
                  {months.map((month) => (
                    <option key={month} value={month.toLowerCase()}>
                      {month}
                    </option>
                  ))}
                </FilterWrapper>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Column */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Spending Distribution
                </h2>
                <CategoryDonutChart categories={categoryTotals} />
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  All Categories
                </h2>
                {categoryTotalsIsPending ? (
                  <div className="text-center py-10 text-gray-500">
                    Loading...
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {categoryTotals?.map((category) => (
                      <CategoryRow key={category.id} category={category} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
