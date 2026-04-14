import { useState } from 'react';
import SupportedBanksSelectionRow from './SupportedBanksSelectionRow';
import { NavLink } from 'react-router-dom';

export default function SupportedBanksSelectionComponent({
  setSelectedBankId,
  institutions,
  setStepCount,
  scrollToStep2,
}) {
  const [selectedBank, setSelectedBank] = useState(null);

  function handleSelect(bank) {
    setSelectedBank(bank.domain);
    setSelectedBankId(bank.id);
    setStepCount(2);
    scrollToStep2();
  }

  return (
    <div className="flex flex-col gap-y-6">
      <span className="text-xs text-center font-semibold text-fg-quaternary uppercase tracking-wider">
        1.Select Your Institution
      </span>
      <div className="flex flex-wrap justify-center items-start gap-8">
        {institutions && institutions.length > 0 ? (
          institutions.map((bank) => (
            <SupportedBanksSelectionRow
              key={bank.external_id}
              bankUrl={bank.domain}
              name={bank.name}
              isSelected={selectedBank === bank.domain}
              onSelect={() => handleSelect(bank)}
            />
          ))
        ) : (
          <div>
            No bank data available, please{' '}
            <NavLink to="/settings/accounts">
              <span className="font-semibold">sync your accounts.</span>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
