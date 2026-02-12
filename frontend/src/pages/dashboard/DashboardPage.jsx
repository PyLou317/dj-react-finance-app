import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { fetchCategoryTotals } from '../../api/categories';
import { fetchBudgets } from '../../api/budgets';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import TopNavbar from '../../components/navbar/TopNavBar';
import BudgetCard from './BudgetCard';
import AccountCardCarousel from './AccountCardCarousel';
import TransCard from './TransCard';
import CategoryCard from './CategoryCard';
import MonthlyExpenseBarChart from './MonthlyExpenseBarChart';
import PageWrapper from '../../components/PageWrapper';

export default function DashboardPage() {
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();

  const [monthFilter, setMonthFilter] = useState(monthName);
  const [yearFilter, setYearFilter] = useState(year);

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
    queryKey: ['categoryTotals', monthFilter, yearFilter],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategoryTotals(token, monthFilter, yearFilter);
    },
    placeholderData: keepPreviousData,
  });

  function handleMonthFilter(month) {
    setMonthFilter(month.target.value);
  }

  const years = [];
  for (let i = year - 2; i <= year; i++) {
    years.push(i);
  }

  function handleYearFilter(year) {
    setYearFilter(year.target.value);
  }

  return (
    <>
      <TopNavbar />
      <PageWrapper>
        <div className="mx-auto mb-2">
          <AccountCardCarousel />
        </div>
        <div className="sm:grid sm:grid-cols-2 flex flex-col gap-x-4 gap-y-2 justify-center">
          <BudgetCard budgets={budgets} categoryTotals={categoryTotals} />
          <CategoryCard categoryTotals={categoryTotals} />
          <TransCard />
          <MonthlyExpenseBarChart
            data={categoryTotals}
            handleMonthFilter={handleMonthFilter}
            handleYearFilter={handleYearFilter}
            years={years}
            monthFilter={monthFilter}
            yearFilter={yearFilter}
          />
        </div>
      </PageWrapper>
    </>
  );
}
