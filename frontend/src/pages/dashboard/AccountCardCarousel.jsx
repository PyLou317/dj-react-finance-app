import { useAuth } from '@clerk/clerk-react';
import fetchAccounts from '../../api/accounts';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import AccountCard from './AccountCard';
import Title from './CardTItle';
import SkeletonAccountCard from './SkeletonAccountCard';
import { sortAccounts } from '../../utils/sortAccounts';

export default function AccountCardCarousel() {
  const { getToken } = useAuth();
  const skeletonCards = [1, 2, 3];

  const {
    isPending,
    isFetching,
    data: accounts,
    error,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const token = await getToken();
      return fetchAccounts(token);
    },
    placeholderData: keepPreviousData,
  });

  const sortedAccounts = sortAccounts(accounts);

  return (
    <>
      <Title name="My Accounts" />
      <div className="flex flex-row w-full gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {isPending || isFetching ? (
          skeletonCards.map((i) => <SkeletonAccountCard key={i} />)
        ) : sortedAccounts && sortedAccounts.length > 0 ? (
          sortedAccounts?.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              isPending={isPending}
              isFetching={isFetching}
            />
          ))
        ) : (
          <>
            <div className="flex flex-col p-6 rounded-3xl min-w-80 min-h-50 border border-gray-400 bg-neutral-900 justify-between">
              <div className="w-8 h-8 rounded-2xl bg-neutral-700"></div>
              <div className="flex flex-row justify-between items-center">
                <div className="space-y-2">
                  <div className="h-6 w-40 text-gray-100 rounded">No Data</div>
                </div>
              </div>
              <div className="h-4 w-48 text-gray-100 rounded">
                Please sync accounts
              </div>
            </div>
            <div className="flex flex-col p-6 rounded-3xl min-w-80 min-h-50 border border-gray-400 bg-neutral-900 justify-between">
              <div className="w-8 h-8 rounded-2xl bg-neutral-700"></div>
              <div className="flex flex-row justify-between items-center">
                <div className="space-y-2">
                  <div className="h-6 w-40 text-gray-100 rounded">No Data</div>
                </div>
              </div>
              <div className="h-4 w-48 text-gray-100 rounded">
                Please sync accounts
              </div>
            </div>
            <div className="flex flex-col p-6 rounded-3xl min-w-80 min-h-50 border border-gray-400 bg-neutral-900 justify-between">
              <div className="w-8 h-8 rounded-2xl bg-neutral-700"></div>
              <div className="flex flex-row justify-between items-center">
                <div className="space-y-2">
                  <div className="h-6 w-40 text-gray-100 rounded">No Data</div>
                </div>
              </div>
              <div className="h-4 w-48 text-gray-100 rounded">
                Please sync accounts
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
