import { useState } from 'react';

import CompanyLogo from '../../components/Logo';
import { EyeClosed, Eye } from 'lucide-react';

export default function AccountCard({ account }) {
  const [isVisible, setIsVisible] = useState(true);

  if (account.balance == 0) {
    return null;
  }

  function handleHideBalance() {
    setIsVisible(!isVisible);
  }

  return (
    <div className="flex flex-col p-6 rounded-3xl min-w-60 min-h-50 border border-gray-400 bg-neutral-900 text-white justify-between">
      <CompanyLogo
        name={
          account.org.name == "President's Choice Bank"
            ? "Steve's No Frills"
            : account?.org?.name
        }
        className="w-8 h-8"
      />
      <div className="flex flex-row justify-between">
        <span className="flex flex-col text-lg">
          Balance:{' '}
          {isVisible ? (
            <span className="text-xl">
              {Number(account?.balance ?? 0).toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD',
              })}
            </span>
          ) : (
            '* * * * *'
          )}
        </span>
        <button onClick={handleHideBalance} className="cursor-pointer">
          {isVisible ? <EyeClosed /> : <Eye />}
        </button>
      </div>
      <h1>
        {account.name == 'Account'
          ? account.org.name + ' Chequing'
          : account.name}
      </h1>
    </div>
  );
}
