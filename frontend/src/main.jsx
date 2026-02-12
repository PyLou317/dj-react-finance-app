import './index.css';
import App from './App.jsx';
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';

import { BrowserRouter, Routes, Route } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import DashboardPage from './pages/dashboard/DashboardPage';
import TransactionsPage from './pages/transactions/TransactionsPage.jsx';
import TransactionDetailPage from './pages/transactions/TransactionDetailPage.jsx';
import CategoriesPage from './pages/categories/CategoriesPage.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk publishable key to the .env file.');
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<DashboardPage />} />
              <Route path="transaction-list" element={<TransactionsPage />}>
                <Route
                  path=":transactionId"
                  element={<TransactionDetailPage />}
                />
              </Route>
              <Route path="categories" element={<CategoriesPage />} />
            </Route>
          </Routes>
        </ClerkProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
