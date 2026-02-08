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
        {isPending
          ? skeletonCards.map((i) => <SkeletonAccountCard key={i} />)
          : sortedAccounts?.map((account) => (
              <AccountCard
                account={account}
                isPending={isPending}
                isFetching={isFetching}
              />
            ))}
      </div>
    </>
  );
}
