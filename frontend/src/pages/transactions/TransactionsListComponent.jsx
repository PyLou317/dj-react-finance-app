import { useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet, useParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { syncTransactions } from '../../api/transactions';
import { fetchTransactions } from '../../api/transactions';

import TransList from './TransListTable';
import MainTitle from '../../components/MainTitle';
import Loader from '../../components/Loader';
import PageWrapper from '../../components/PageWrapper';
import TransactionStatBar from './TransactionStatBar';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const { transactionsId } = useParams();
  const { getToken } = useAuth();

  const queryClient = useQueryClient();
  const syncTransMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return syncTransactions(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Error syncing transactions:', error);
      alert('Failed to sync transactions. Please try again. ' + error.message);
    },
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
      page,
    ],
    queryFn: async () => {
      const token = await getToken();
      return fetchTransactions(
        token,
        searchTerm,
        yearFilter,
        monthFilter,
        categoryFilter,
        page,
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

  const handleSyncTransactions = (e) => {
    e.preventDefault();
    syncTransMutation.mutate();
  };

  return (
    <div>
      {transactionsId ? (
        <Outlet />
      ) : (
        <PageWrapper>
          {/* Page Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <MainTitle name="Transactions" />

            {/* Sync Button */}
            <button
              onClick={handleSyncTransactions}
              disabled={syncTransMutation.isPending}
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {syncTransMutation.isPending ? (
                <>
                  <Loader size={4} />
                  <span>Syncing...</span>
                </>
              ) : (
                <span>Sync Transactions</span>
              )}
            </button>
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
            />
          </div>
        </PageWrapper>
      )}
    </div>
  );
}
