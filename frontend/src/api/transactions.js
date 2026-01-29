export const fetchTransactions = async (token, searchTerm = '') => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/transactions/${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};

export const fetchDashboardTransactions = async (token) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/dashboard/transactions/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }

  return response.json();
};
