import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Outlet, useParams } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { fetchCategoryTotals, fetchCategories } from '../../api/categories';

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
  const [addCatParent, setAddCatParent] = useState(false);
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
    queryKey: ['categorues'],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategories(token);
    },
    placeholderData: keepPreviousData,
  });

  const categoryParents = categories?.filter((cat) => cat?.parent);
  const seenIds = new Set();
  const uniqueParents = categoryParents?.filter((cat) => {
    if (seenIds.has(cat.parent.id)) {
      return false;
    } else {
      seenIds.add(cat.parent.id);
      return true;
    }
  });

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

  function toggleAddCatParent(e) {
    e.preventDefault();
    setAddCatParent(!addCatParent);
  }

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
                onClick={() => setIsOpen(true)}
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
        title="Add Category"
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

          <div className={`${addCatParent ? 'mb-2' : 'mb-6'}`}>
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block text-gray-700 text-sm font-bold">
                Parent Category
              </label>
              <button
                type="submit"
                className="text-[10px] sm:text-[14px] bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                onClick={(e) => toggleAddCatParent(e)}
              >
                {addCatParent ? 'Cancel' : 'Add Parent'}
              </button>
            </div>
            {!addCatParent ? (
              <select
                name="parent"
                //   value={formData.parent}
                //   onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Parent</option>
                {uniqueParents?.map((cat) => (
                  <option key={cat?.parent?.id} value={cat?.parent?.id}>
                    {cat?.parent?.name}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          <div
            className={`${addCatParent ? 'opacity-100' : 'opacity-0 hidden'} rounded-lg transition duration-300 ease-in-out`}
          >
            <input
              type="text"
              name="name"
              //   value={formData.name}
              //   onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Food & Drink"
            />
          </div>
          {addCatParent ? (
            <button
              type="submit"
              className="mt-2 w-full bg-neutral-800 text-white py-1 px-4 rounded-lg hover:bg-neutral-900 transition duration-200"
            >
              Add Parent
            </button>
          ) : null}

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Create Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
