import { useAuth } from '@clerk/clerk-react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchTransactions } from '../../api/transactions';

import CompanyLogo from '../../components/Logo';
import { Link } from 'react-router-dom';

function TransList({ searchTerm }) {
  const { getToken } = useAuth();
  const {
    isPending,
    isError,
    data: transactions,
    error,
  } = useQuery({
    queryKey: ['transactions', searchTerm],
    queryFn: async () => {
      const token = await getToken();
      return fetchTransactions(token, searchTerm);
    },
    placeholderData: keepPreviousData,
  });

  const count = transactions?.count ?? 0;

  const groupedTransactions = transactions?.results
    ? transactions.results.reduce((groups, trans) => {
        const date = trans.date_posted;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(trans);
        return groups;
      }, {})
    : {};

  const totalSum = Number(transactions?.total_sum);

  return (
    <div>
      <div className="flex flex-row mb-2 text-sm items-start justify-between text-gray-400">
        <div className="flex flex-row gap-1">
          <p>Count:</p>
          <span>
            {count?.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-1">
            <p>Sum:</p>
            <span>
              {totalSum >= 0 ? '+' : '-'}$
              {Math.abs(totalSum).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="mb-6">
          <h3 className="py-1 text-xs font-bold text-gray-500 uppercase sticky top-0">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </h3>
          <ul>
            {groupedTransactions[date].map((trans) => (
              <Link to={`${trans.id}`}>
                <li
                  key={trans.id}
                  className="flex flex-row gap-4 p-2 items-center bg-white rounded-xl my-2 hover:scale-102  "
                >
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
        </div>
      ))}
    </div>
  );
}

export default TransList;
