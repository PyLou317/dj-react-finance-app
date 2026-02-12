import { useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCategories } from '../../api/categories';
import { fetchTransactions } from '../../api/transactions';

import CompanyLogo from '../../components/Logo';
import { Link } from 'react-router-dom';
import { Loader } from 'lucide-react';

import '../../utils/toolTipStyles.css';
import FilterDropDown from './FilterDropDown';
import TransactionStatBar from './TransactionStatBar';
import FilterComponent from './FilterComponent';

function TransList({ searchTerm }) {
  const [openFilters, setOpenFilters] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { getToken } = useAuth();

  const {
    data: categoryData,
    isPending: categoryIsPending,
    error: categoryError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategories(token);
    },
    placeholderData: keepPreviousData,
  });

  const {
    isPending,
    isError,
    data: transactions,
    error,
  } = useQuery({
    queryKey: [
      'transactions',
      searchTerm,
      yearFilter,
      monthFilter,
      categoryFilter,
    ],
    queryFn: async () => {
      const token = await getToken();
      return fetchTransactions(
        token,
        searchTerm,
        yearFilter,
        monthFilter,
        categoryFilter,
      );
    },
    placeholderData: keepPreviousData,
  });

  const count = transactions?.count ?? 0;

  const groupedTransactions = useMemo(() => {
    return transactions?.results
      ? transactions.results.reduce((groups, trans) => {
          const date = trans.date_posted;
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(trans);
          return groups;
        }, {})
      : {};
  }, [transactions]);

  const totalSum = Number(transactions?.total_sum);

  const today = new Date();
  const year = today.getFullYear();

  const years = [];
  for (let i = year - 2; i <= year; i++) {
    years.push(i);
  }
  years.reverse();

  function handleYearChange(e) {
    setYearFilter(e.target.value);
  }

  function clearFilters() {
    setYearFilter('');
    setMonthFilter('');
    setCategoryFilter('');
  }

  return (
    <div>
      <FilterComponent
        openFilters={openFilters}
        clearFilters={clearFilters}
        setOpenFilters={setOpenFilters}
      />

      {openFilters ? (
        <FilterDropDown
          handleYearChange={handleYearChange}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          years={years}
          setMonthFilter={setMonthFilter}
          monthFilter={monthFilter}
          setCategoryFilter={setCategoryFilter}
          categoryFilter={categoryFilter}
          categoryData={categoryData}
        />
      ) : null}

      <TransactionStatBar
        isPending={isPending}
        count={count}
        totalSum={totalSum}
      />

      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="mb-6">
          <h3 className="py-1 text-xs font-bold text-gray-500 uppercase sticky top-0">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </h3>
          {isPending ? (
            <Loader />
          ) : (
            <ul>
              {groupedTransactions[date].map((trans) => (
                <Link to={`${trans.id}`} key={trans.id}>
                  <li
                    key={trans.id}
                    className="flex flex-row gap-4 p-2 items-center bg-white rounded-xl my-2 hover:scale-102 tooltip"
                  >
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
                          {trans.category?.parent?.name} - {trans.category.name}
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
          )}
        </div>
      ))}
    </div>
  );
}

export default TransList;
