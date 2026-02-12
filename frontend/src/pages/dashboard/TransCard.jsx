import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchDashboardTransactions } from '../../api/transactions';

import CompanyLogo from '../../components/Logo';
import Card from './Card';
import Title from './CardTItle';
import { Link } from 'react-router-dom';

export default function TransCard() {
  const { getToken } = useAuth();

  const {
    isPending,
    isError,
    data: slicedTransactions,
    error,
  } = useQuery({
    queryKey: ['slicedTransactions'],
    queryFn: async () => {
      const token = await getToken();
      return fetchDashboardTransactions(token);
    },
    placeholderData: keepPreviousData,
  });

  const data = slicedTransactions?.results;

  const groupedTransactions = data
    ? data.reduce((groups, trans) => {
        const date = trans.date_posted;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(trans);
        return groups;
      }, {})
    : {};

  return (
    <Card>
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <Title name="Recent Transactions" />
          <div className="flex flex-row mb-2 text-sm gap-1 text-gray-400">
            <p>Count:</p>
            <span>
              {data?.length.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
        <Link to="/transaction-list">
          <button className="text-sm pt-1 pe-2 hover:cursor-pointer">
            View All
          </button>
        </Link>
      </div>
      {Object.keys(groupedTransactions).map((date) => (
        <div key={date}>
          <h3 className="py-1 text-xs font-bold text-gray-500 uppercase sticky top-0">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </h3>
          <ul>
            {groupedTransactions[date].map((trans) => (
              <li
                key={trans.id}
                className="flex flex-row gap-4 mb-2 p-2 items-center bg-white rounded-xl"
              >
                <CompanyLogo name={trans.payee} className="w-8 h-8" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold truncate text-[14px]">
                    {trans.payee}
                  </span>
                  {trans.category.parent ? (
                    <span className="text-[14px] truncate text-gray-400 uppercase tracking-wider">
                      {trans.category?.parent?.name} - {trans.category.name}
                    </span>
                  ) : (
                    <span className="text-[14px] truncate text-gray-400 uppercase tracking-wider">
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
            ))}
          </ul>
        </div>
      ))}
    </Card>
  );
}
