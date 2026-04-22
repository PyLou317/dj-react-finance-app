import { useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';

import {
  fetchCategoryTotals,
  fetchCategories,
  fetchCategoryDetails,
} from '../../api/categories';

import CompanyLogo from '../../components/Logo';

import Loader from '../../components/Loader';
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
  const [searchParams, setSearchParams] = useSearchParams();
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

  const categoryId = searchParams.get('category');

  const { isPending: categoryIsPending, data: categoryDetails } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategoryDetails(token, categoryId);
    },
    enabled: !!categoryId,
    placeholderData: keepPreviousData,
  });

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
    setSearchParams((prev) => {
      prev.set('category', id);
      prev.delete('page');
      return prev;
    });
  };

  const selectedCategorySum = useMemo(() => {
    if (!categoryId || !categoryTotals) return 0;
    const found = categoryTotals.find(
      (c) => String(c.id) === String(categoryId),
    );
    return found ? found.category_sum : 0;
  }, [categoryId, categoryTotals]);

  const transactionData = categoryDetails?.transactions;
  const groupedTransactions = useMemo(() => {
    const txns = Array.isArray(transactionData)
      ? transactionData
      : transactionData?.results || [];

    return txns.reduce((groups, trans) => {
      const date = trans.date_posted;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(trans);
      return groups;
    }, {});
  }, [transactionData]);

  return (
    <div className="mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <MainTitle name="Category Breakdown" />
            <button
              className="flex items-center gap-2 md:min-w-75 ms-auto justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              onClick={() => setIsOpen(true)}
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Spending Distribution
          </h2>

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
          <div className="flex justify-center w-full">
            {categoryTotals?.length > 0 ? (
              <CategoryDonutChart categories={categoryTotals} />
            ) : (
              <NoDataAvailable />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Category Transactions
            </h2>
            {categoryId && (
              <span className="text-lg font-bold text-gray-900">
                Total Spent: $
                {Math.abs(selectedCategorySum).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
          <div>
            <div>
              <span className="font-semibold">Select Category:</span>
            </div>
            <div>
              {categoryTotalsIsPending ? (
                <div className="text-center py-10 text-gray-500">
                  Loading...
                </div>
              ) : categoryTotals?.length > 0 ? (
                <select
                  name="category"
                  id="categoryDropDown"
                  defaultValue="placeholder"
                  value={categoryId || 'placeholder'}
                  className="w-full p-2 border-2 border-teal-500 rounded-lg mb-6"
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
            </div>
          </div>

          {!categoryId ? (
            <div className="text-center py-10 text-gray-500">
              Please select a category to view transactions.
            </div>
          ) : categoryIsPending ? (
            <div className="flex justify-center p-10">
              <Loader size={10} />
            </div>
          ) : Object.keys(groupedTransactions).length === 0 ? (
            <div className="pt-2 pb-8">
              <NoDataAvailable />
            </div>
          ) : (
            Object.keys(groupedTransactions).map((date) => (
              <div key={date} className="mb-6">
                <h3 className="py-1 text-xs font-bold text-gray-500 uppercase sticky top-0">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h3>
                <ul>
                  {groupedTransactions[date].map((trans) => (
                    <Link to={`/transaction-list/${trans.id}`} key={trans.id}>
                      <li className="flex flex-row gap-4 p-2 items-center bg-white rounded-xl my-2 hover:scale-102 tooltip">
                        <div className="tooltip-content cursor-pointer truncate max-w-[250px]">
                          {trans.notes != '' && trans.notes != ' '
                            ? trans.notes
                            : 'No notes'}
                        </div>
                        <CompanyLogo name={trans.payee} className="w-8 h-8" />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-semibold truncate text-[14px]">
                            {trans.payee}
                          </span>
                          {trans.category.parent ? (
                            <span className="text-[14px] text-gray-400 uppercase tracking-wider truncate">
                              {trans.category?.parent?.name} -{' '}
                              {trans.category.name}
                            </span>
                          ) : (
                            <span className="text-[14px] text-gray-400 uppercase tracking-wider truncate">
                              {trans.category?.name}
                            </span>
                          )}
                        </div>
                        <span
                          className={`ml-auto font-semibold text-[16px] ${trans.amount >= 0 ? 'text-green-500' : 'text-gray-900'}`}
                        >
                          {trans.amount >= 0 ? '+' : '-'}$
                          {Math.abs(trans.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <AddCategoryModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          categoryParents={categoryParents}
        />
      </div>
    </div>
  );
}
