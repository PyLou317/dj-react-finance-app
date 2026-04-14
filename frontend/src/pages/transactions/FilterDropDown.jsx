import FilterWrapper from './FilterWrapper';
import { capitalize } from '../../utils/capitalizeFirstLetter';

export default function FilterDropDown({
  searchParams,
  setSearchParams,
  openFilters,
  clearFilters,
  years,
  categoryData,
  accountsData,
  orgData,
}) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="mb-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">
          Filter Transactions
        </h3>

        {openFilters ? (
          <button
            className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors cursor-pointer"
            onClick={clearFilters}
          >
            Clear all
          </button>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FilterWrapper
            name="select-year"
            id="select-year"
            selectOnChange={(e) => {
              const selectedValue = e.target.value;
              setSearchParams({
                ...Object.fromEntries(searchParams),
                year: selectedValue,
              });
            }}
            selectValue={searchParams.get('year') || ''}
            cancel={(e) => {
              if (e) e.preventDefault();
              const params = Object.fromEntries(searchParams);
              delete params.year;
              setSearchParams(params);
            }}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </FilterWrapper>

          <FilterWrapper
            name="select-month"
            id="select-month"
            selectOnChange={(e) =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                month: e.target.value,
              })
            }
            selectValue={searchParams.get('month') || ''}
            cancel={(e) => {
              if (e) e.preventDefault();
              const params = Object.fromEntries(searchParams);
              delete params.month;
              setSearchParams(params);
            }}
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month} value={month.toLowerCase()}>
                {month}
              </option>
            ))}
          </FilterWrapper>

          <FilterWrapper
            name="select-category"
            id="select-category"
            selectOnChange={(e) =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                category: e.target.value,
              })
            }
            selectValue={searchParams.get('category') || ''}
            cancel={(e) => {
              if (e) e.preventDefault();
              const params = Object.fromEntries(searchParams);
              delete params.category;
              setSearchParams(params);
            }}
          >
            <option value="">All Categories</option>
            {categoryData?.map((cat) => (
              <option key={cat.id} value={cat?.id}>
                {cat?.parent
                  ? `${cat.parent.name}: ${capitalize(cat.name)}`
                  : cat.name}
              </option>
            ))}
          </FilterWrapper>

          <FilterWrapper
            name="select-org"
            id="select-org"
            selectOnChange={(e) =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                org: e.target.value,
              })
            }
            selectValue={searchParams.get('org') || ''}
            cancel={(e) => {
              if (e) e.preventDefault();
              const params = Object.fromEntries(searchParams);
              delete params.org;
              setSearchParams(params);
            }}
          >
            <option value="">All Banks</option>
            {orgData?.map((org) => (
              <option key={org?.id} value={org?.id}>
                {org?.name}
              </option>
            ))}
          </FilterWrapper>

          <FilterWrapper
            name="select-account"
            id="select-account"
            selectOnChange={(e) =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                account: e.target.value,
              })
            }
            selectValue={searchParams.get('account') || ''}
            cancel={(e) => {
              if (e) e.preventDefault();
              const params = Object.fromEntries(searchParams);
              delete params.account;
              setSearchParams(params);
            }}
          >
            <option value="">All Accounts</option>
            {accountsData?.map((account) => (
              <option key={account.id} value={account?.id}>
                {account.name}
              </option>
            ))}
          </FilterWrapper>
        </div>
      </div>
    </div>
  );
}
