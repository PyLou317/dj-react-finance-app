const fetchBudgets = async (token) => {
  const response = await fetch(`http://127.0.0.1:8000/api/budgets/`, {
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

export default fetchBudgets;
