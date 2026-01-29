import { useState, useEffect } from 'react';

import BudgetCard from './BudgetCard';
import AccountCardCarousel from './AccountCardCarousel';
import TransCard from './TransCard';

function DashboardPage() {
  return (
    <>
      <AccountCardCarousel />
      <BudgetCard />
      <TransCard />
    </>
  );
}

export default DashboardPage;
