const VITE_API_URL = import.meta.env.VITE_API_URL;
const apiUrl = VITE_API_URL || 'http://127.0.0.1:8000/';

export const fetchBudgets = async (token) => {
  const response = await fetch(`${apiUrl}api/budgets/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch budgets: ${response.statusText}`);
  }

  return response.json();
};
