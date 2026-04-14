import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { NavLink } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchTransactions } from '../../api/transactions';

import TransList from './TransListTable';
import MainTitle from '../../components/MainTitle';
import PageWrapper from '../../components/PageWrapper';
import TransactionStatBar from './TransactionStatBar';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { transactionsId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getToken } = useAuth();

  const currentPage = searchParams.get('page') || '1';
  const currentMonth = searchParams.get('month') || '';
  const currentYear = searchParams.get('year') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentOrg = searchParams.get('org') || '';
  const currentAccount = searchParams.get('account') || '';

  const {
    isPending,
    isError,
    data: transactions,
    error,
  } = useQuery({
    queryKey: [
      'transactions',
      searchTerm,
      currentYear,
      currentMonth,
      currentCategory,
      currentOrg,
      currentAccount,
      currentPage,
    ],
    queryFn: async () => {
      const token = await getToken();
      return fetchTransactions(
        token,
        searchTerm,
        currentYear,
        currentMonth,
        currentCategory,
        currentOrg,
        currentAccount,
        currentPage,
      );
    },
    placeholderData: keepPreviousData,
  });

  const PAGE_SIZE = 20;
  const pageCount = Math.ceil(Number(transactions?.count) / PAGE_SIZE);

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

  return (
    <div>
      {transactionsId ? (
        <Outlet />
      ) : (
        <PageWrapper>
          {/* Page Header Area */}
          <div className="flex flex-row sm:items-center justify-between gap-4 mb-6">
            <MainTitle name="Transactions" />
            <NavLink to="/upload">
              <button className="font-semibold py-2 px-4 bg-teal-500 text-white rounded-xl cursor-pointer hover:bg-teal-400">
                Upload
              </button>
            </NavLink>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-2">
            <TransactionStatBar
              isPending={isPending}
              count={count}
              totalSum={totalSum}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <TransList
              transactions={groupedTransactions}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentPage={currentPage}
              isPending={isPending}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              previous={transactions?.previous}
              next={transactions?.next}
              pageCount={pageCount}
            />
          </div>
        </PageWrapper>
      )}
    </div>
  );
}
