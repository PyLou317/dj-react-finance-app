import { useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Outlet, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchTransactions } from '../../api/transactions';

import TransList from './TransListTable';
import MainTitle from '../../components/MainTitle';
import PageWrapper from '../../components/PageWrapper';
import TransactionStatBar from './TransactionStatBar';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const { transactionsId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getToken } = useAuth();

  const currentPage = searchParams.get('page') || '1';

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
      currentPage,
    ],
    queryFn: async () => {
      const token = await getToken();
      return fetchTransactions(
        token,
        searchTerm,
        yearFilter,
        monthFilter,
        categoryFilter,
        currentPage,
      );
    },
    placeholderData: keepPreviousData,
  });

  console.log(transactions);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <MainTitle name="Transactions" />
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
              monthFilter={monthFilter}
              setMonthFilter={setMonthFilter}
              yearFilter={yearFilter}
              setYearFilter={setYearFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              page={page}
              setPage={setPage}
              isPending={isPending}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </PageWrapper>
      )}
    </div>
  );
}
