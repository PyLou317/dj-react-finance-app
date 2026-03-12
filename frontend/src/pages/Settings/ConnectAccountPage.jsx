import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { syncTransactions } from '../../api/transactions';
import Modal from '../../components/Modal';
import { useState } from 'react';

export default function ConnectAccountPage() {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSyncTransactions = (e) => {
    e.preventDefault();
    syncTransMutation.mutate();
  };

  const handleToggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <h1 className="font-bold text-3xl mb-4">Sync Bank Data</h1>
      <button
        onClick={handleToggleModal}
        className="flex p-8 bg-gray-50 rounded-xl items-center justify-center mb-4 border-2 border-gray-400 transition-colors cursor-pointer disabled:opacity-50 w-full hover:bg-teal-100 hover:border-teal-500"
      >
        <span>Click to Sync Bank Transactions</span>
      </button>
      <Modal
        isOpen={isOpen}
        onClose={handleToggleModal}
        title="Sync Bank Transactions"
      >
        <div className="flex flex-col items-center justify-center gap-y-4">
          <p>Agree to sync the last 6 days of bank transactions?</p>
          <button
            className="bg-teal-400 px-3 py-1 rounded-xl text-white w-full hover:bg-teal-500"
            disabled={syncTransMutation.isPending}
            onClick={handleSyncTransactions}
          >
            {syncTransMutation.isPending ? (
              <>
                <Loader size={4} />
                <span>Syncing...</span>
              </>
            ) : (
              <span>Yes</span>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
