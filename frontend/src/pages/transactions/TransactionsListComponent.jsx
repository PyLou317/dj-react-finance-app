import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet, useParams } from 'react-router-dom';
import { syncTransactions } from '../../api/transactions';

import TransList from './TransListTable';
import SearchBar from '../../components/searchbar/SearchBar';
import MainTitle from '../../components/MainTitle';
import Loader from '../../components/Loader';
import PageWrapper from '../../components/PageWrapper';

export default function TransactionsPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const { transactionsId } = useParams();
  const { getToken } = useAuth();

  const handleSearch = (value) => {
    setSearchFilter(value);
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
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

          {/* Search Bar - Contained */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* List Area - Card Container */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <TransList searchTerm={searchFilter} />
          </div>
        </PageWrapper>
      )}
    </div>
  );
}
