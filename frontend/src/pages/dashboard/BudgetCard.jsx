import { useAuth } from '@clerk/clerk-react';
import fetchBudgets from '../../api/budgets';
import { fetchCategoryTotals } from '../../api/categories';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { capitalize } from '../../utils/capitalizeFirstLetter';
import ProgressBar from './ProgressBar';
import Card from './Card';
import Title from './TItle';
import { useMemo } from 'react';
import isEqual from 'fast-deep-equal';

export default function BudgetCard() {
  const { getToken } = useAuth();

  const {
    isPending: budgetsIsPending,
    isError: budgetsIsError,
    data: budgets,
    error: budgetsError,
  } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const token = await getToken();
      return fetchBudgets(token);
    },
    placeholderData: keepPreviousData,
  });

  const {
    isPending: categoryTotalsIsPending,
    isError: categoryTotalsIsError,
    data: categoryTotals,
    error: categoryTotalsError,
  } = useQuery({
    queryKey: ['categoryTotals'],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategoryTotals(token);
    },
    placeholderData: keepPreviousData,
  });

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
    return budgets.map((budget) => {
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
      <Title name={title} />
      <ul className="flex flex-col gap-y-2">
        {mergedData?.map((budget) => {
          return (
            <li key={budget.id} className="text-xs">
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
    </Card>
  );
}
