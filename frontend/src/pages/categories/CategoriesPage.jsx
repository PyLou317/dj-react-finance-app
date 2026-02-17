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
import Modal from '../../components/Modal';

export default function CategoriesPage() {
  const [openFilters, setOpenFilters] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const { categoryId } = useParams();
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

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {categoryId ? (
        <Outlet />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col">
            <div className="grid grid-cols-2 sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <MainTitle name="Category Breakdown" />
              <button
                className="flex items-center gap-2 max-w-[150px] ms-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                onClick={openModal}
              >
                Add Category
              </button>
            </div>

            <FilterComponent
              openFilters={openFilters}
              clearFilters={clearFilters}
              setOpenFilters={setOpenFilters}
            />

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
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        title="Add New Category"
      >
        <form
        //   onSubmit={handleSubmit}
          className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add New Category
          </h2>

          {/* {message && (
            <div
              className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {message}
            </div>
          )} */}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
            //   value={formData.name}
            //   onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Color
              </label>
              <input
                type="color"
                name="color"
                // value={formData.color}
                // onChange={handleChange}
                className="w-full h-10 cursor-pointer rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Parent Category (Optional)
            </label>
            <select
              name="parent"
            //   value={formData.parent}
            //   onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Parent</option>
              {/* {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))} */}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-200"
          >
            Create Category
          </button>
        </form>
      </Modal>
    </div>
  );
}
