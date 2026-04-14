import { forwardRef } from 'react';

const selectAccountDropdown = forwardRef(
  ({ accounts, setSelectedAccountId, setStepCount, scrollToStep3 }, ref) => {
    function handleSelectAccount(e) {
      setSelectedAccountId(e.target.value);
      setStepCount(3);
      scrollToStep3();
    }

    return (
      <div className="flex flex-col items-center gap-3" ref={ref}>
        <label
          htmlFor="selectAccount"
          className="text-xs text-center font-semibold text-fg-quaternary uppercase tracking-wider"
        >
          2.Select your account
        </label>
        <select
          name="selectAccount"
          id="selectAccount"
          value="select-account"
          className="border-b border-gray-400 px-3 py-1 rounded-md min-w-75"
          onChange={handleSelectAccount}
        >
          <option value="select-account" disabled>
            {accounts?.length === 0
              ? 'No accounts found'
              : 'Select an account...'}
          </option>
          {accounts?.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

export default selectAccountDropdown;
