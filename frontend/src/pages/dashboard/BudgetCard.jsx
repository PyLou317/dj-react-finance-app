import { capitalize } from '../../utils/capitalizeFirstLetter';
import { useMemo } from 'react';

import Card from './Card';
import Title from './CardTItle';
import ProgressBar from './ProgressBar';
import NoDataAvailable from './NoDataAvailable';

export default function BudgetCard({ budgets, categoryTotals }) {
  const mergedData = useMemo(() => {
    if (!budgets?.length || !categoryTotals?.length) return [];

    // 1. Create a lookup for spending totals: { "groceries": 500, "gas": 100 }
    const spendingLookup = new Map(
      categoryTotals.map((cat) => [
        cat.name.toLowerCase(),
        cat.category_sum || 0,
      ]),
    );

    // 2. Attach the spending to the budget
    return budgets?.map((budget) => {
      const categoryName = budget.category?.name?.toLowerCase();
      const spending = spendingLookup.get(categoryName) || 0;

      return {
        ...budget,
        spent: spending,
        remaining: parseFloat(budget.amount) - spending,
      };
    });
  }, [budgets, categoryTotals]);

  const date = new Date();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const title = monthName + ' ' + 'Budget';
  return (
    <Card>
      <div className="flex flex-col">
        <Title name={title} />
        {mergedData?.length === 0 ? (
          <NoDataAvailable />
        ) : (
          <ul className="flex flex-col gap-y-2">
            {mergedData?.map((budget) => {
              return (
                <li key={budget.id} className="text-xs my-1">
                  <span className="font-semibold">
                    {budget.category.parent
                      ? capitalize(budget?.category?.parent.name) +
                        ' ' +
                        capitalize(budget?.category?.name)
                      : capitalize(budget?.category?.name)}
                    :{' '}
                  </span>
                  {Math.abs(budget.spent).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{' '}
                  / {Math.trunc(budget.amount)}
                  <ProgressBar
                    current={Math.trunc(Math.abs(budget.spent))}
                    total={Math.trunc(budget.amount)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
