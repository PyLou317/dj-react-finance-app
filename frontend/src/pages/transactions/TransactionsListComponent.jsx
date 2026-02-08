import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet, useParams } from 'react-router-dom';
import { syncTransactions } from '../../api/transactions';

import TransList from './TransListTable';
import SearchBar from '../../components/searchbar/SearchBar';
import MainTitle from '../../components/MainTitle';
import Loader from '../../components/Loader';

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
    <>
      <div className="flex items-center justify-between mb-4">
        <MainTitle name="Transactions" />
        <div className="flex-none">
          <button
            onClick={handleSyncTransactions}
            className="bg-teal-400 hover:bg-teal-500 text-white font-medium py-1 px-4 rounded-2xl transition-colors cursor-pointer"
          >
            {syncTransMutation.isPending ? (
              <div className="flex flex-row gap-2">
                <Loader size={4} />
                <span>Syncing...</span>
              </div>
            ) : (
              <span>Sync</span>
            )}
          </button>
        </div>
      </div>

      <div className="my-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      {transactionsId ? <Outlet /> : <TransList searchTerm={searchFilter} />}
    </>
  );
}
