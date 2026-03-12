import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Outlet, useParams } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import {
  fetchCategoryTotals,
  fetchCategories,
  fetchCategoryDetails,
} from '../../api/categories';

import { capitalize } from '../../utils/capitalizeFirstLetter';
import MainTitle from '../../components/MainTitle';
import CategoryRow from '../dashboard/categoryRow';
import FilterWrapper from '../transactions/FilterWrapper';
import FilterComponent from '../transactions/FilterComponent';
import CategoryDonutChart from './CategoriesDonutChart';
import AddCategoryModal from './AddCategoryModal';
import NoDataAvailable from '../dashboard/NoDataAvailable';

export default function CategoriesPage() {
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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

  const { isPending: categoriesIsPending, data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategories(token);
    },
    placeholderData: keepPreviousData,
  });

  const { isPending: categoryIsPending, data: categoryDetails } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategoryDetails(token, categoryId);
    },
    placeholderData: keepPreviousData,
  });

  console.log('Category: ', categoryDetails);

  const categoryParents = categories?.filter((cat) => !cat?.parent);

  const today = new Date();
  const year = today.getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => year - i);

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

  function clearFilters() {
    setYearFilter('');
    setMonthFilter('');
  }

  const handleCategorySelect = (e) => {
    const id = e.target.value;
    setCategoryId(id);
    console.log('Selected ID:', id);
  };

  return (
    <div className="mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <MainTitle name="Category Breakdown" />
            <button
              className="flex items-center gap-2 max-w-[150px] ms-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              onClick={() => setIsOpen(true)}
            >
              Add Category
            </button>
          </div>

          {/* Filter Dropdown Panel */}
          {categoryTotals?.length > 0 ? (
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
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Spending Distribution
              </h2>
              {categoryTotals?.length > 0 ? (
                <CategoryDonutChart categories={categoryTotals} />
              ) : (
                <NoDataAvailable />
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Categories with Spending
              </h2>
              {categoryTotalsIsPending ? (
                <div className="text-center py-10 text-gray-500">
                  Loading...
                </div>
              ) : categoryTotals?.length > 0 ? (
                <select
                  name="category"
                  id="categoryDropDown"
                  defaultValue="placeholder"
                  value={categoryId}
                  className="w-full p-2 border-2 border-teal-500 rounded-lg"
                  onChange={handleCategorySelect}
                >
                  <option disabled={true} value="placeholder">
                    Select Category
                  </option>
                  {categoryTotals?.map((category) => (
                    <option key={category.id} value={category?.id}>
                      {category?.parent
                        ? category?.parent?.name +
                          ': ' +
                          capitalize(category?.name)
                        : category?.name}
                    </option>
                  ))}
                </select>
              ) : (
                <NoDataAvailable />
              )}
              {categoryTotals?.length > 0 ? (
                <div className="mt-4 p-4 border border-gray rounded-xl">
                  Category Name
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        categoryParents={categoryParents}
      />
    </div>
  );
}
