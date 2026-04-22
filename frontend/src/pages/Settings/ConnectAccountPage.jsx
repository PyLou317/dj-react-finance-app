import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import { syncTransactions } from '../../api/transactions';
import { deleteAccount } from '../../api/accounts';
import Modal from '../../components/Modal';
import { useState } from 'react';
import Loader from '../../components/Loader';
import CompanyLogo from '../../components/Logo';

export default function ConnectAccountPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [pendingResolutionData, setPendingResolutionData] = useState(null); // NEW STATE
  const { getToken } = useAuth();

  const queryClient = useQueryClient();
  const syncTransMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return syncTransactions(token);
    },
    onSuccess: (response) => {
      if (response.status === 'pending_resolution') {
        setPendingResolutionData(response);
        setIsOpen(false); // Close the initial sync modal
      } else {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
        setIsOpen(false);
      }
    },
    onError: (error) => {
      console.error('Error syncing transactions:', error);
      alert('Failed to sync transactions. Please try again. ' + error.message);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (accountId) => {
      const token = await getToken();
      return deleteAccount(token, accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setAccountToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. ' + error.message);
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
              <span className="flex justify-center items-center gap-x-2">
                <Loader size={3} />
                <span>Syncing...</span>
              </span>
            ) : (
              <span>Yes</span>
            )}
          </button>
        </div>
      </Modal>

      <div className="mt-12">
        <h2 className="font-bold text-2xl mb-6">Linked Accounts</h2>
        {orgsPending || accountsPending ? (
          <div className="flex justify-center p-10">
            <Loader size={10} />
          </div>
        ) : orgs?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {orgs.map((org) => (
              <div
                key={org.id}
                className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                  <CompanyLogo
                    domain={org.domain}
                    name={org.name}
                    className="size-12"
                  />
                  <h3 className="font-bold text-xl text-gray-800">
                    {org.name}
                  </h3>
                </div>
                <div className="space-y-4">
                  {accounts
                    ?.filter((acc) => (acc.org?.id || acc.org) === org.id)
                    .map((account) => (
                      <div
                        key={account.id}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {account.name}
                          </p>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                            Last synced:{' '}
                            {account.balance_date
                              ? new Date(
                                  account.balance_date,
                                ).toLocaleDateString()
                              : 'Never'}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-lg text-gray-900">
                            $
                            {Number(account.balance).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            {account.currency}
                          </p>
                        </div>
                        <button
                          onClick={() => setAccountToDelete(account)}
                          className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No bank accounts linked yet.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!accountToDelete}
        onClose={() => setAccountToDelete(null)}
        title="Delete Account"
      >
        <div className="flex flex-col gap-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <strong>{accountToDelete?.name}</strong>?
          </p>
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              Warning: Deleting this account will also delete all linked
              transactions. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-x-3">
            <button
              onClick={() => setAccountToDelete(null)}
              className="flex-1 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              disabled={deleteAccountMutation.isPending}
              onClick={() => deleteAccountMutation.mutate(accountToDelete.id)}
              className="flex-1 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 font-medium"
            >
              {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
