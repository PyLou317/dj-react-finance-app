import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import CompanyLogo from '../../components/Logo';

function TransList() {
  const { getToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState();

  useEffect(() => {
    async function fetchData() {
      const token = await getToken();
      const response = await fetch('http://127.0.0.1:8000/api/transactions/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setTransactions(data.results);
      setCount(data.count);
    }

    fetchData();
  }, []);

  const groupedTransactions = transactions.reduce((groups, trans) => {
    const date = trans.date_posted;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(trans);
    return groups;
  }, {});

  console.log(transactions);

  return (
    <>
      <div className="flex flex-row mb-2 text-sm gap-1">
        <p>Count:</p>
        <span>
          {count?.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      </div>
      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="mb-6">
          {/* THE DATE HEADER - only shows once per group */}
          <h3 className="px-3 py-1 text-xs font-bold text-gray-500 uppercase bg-gray-50 sticky top-0">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </h3>
          <ul>
            {groupedTransactions[date].map((trans) => (
              <>
                <li
                  key={trans.id}
                  className="flex flex-row gap-4 p-3 items-center bg-white"
                >
                  <CompanyLogo name={trans.payee} className="w-8 h-8" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{trans.payee}</span>
                    {trans.category.parent ? (
                      <span className="text-sm text-gray-400 uppercase tracking-wider">
                        {trans.category?.parent?.name} - {trans.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 uppercase tracking-wider">
                        {trans.category?.name}
                      </span>
                    )}
                  </div>
                  <span
                    className={`ml-auto font-semibold ${trans.amount >= 0 ? 'text-green-500' : 'text-gray-900'}`}
                  >
                    {trans.amount >= 0 ? '+' : '-'}$
                    {Math.abs(trans.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </li>
              </>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default TransList;
