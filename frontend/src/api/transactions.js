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

export const fetchTransactionDetails = async (token, Id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/transactions/${Id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transaction data: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};

export const syncTransactions = async (token) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/sync-transactions/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to sync transaction data: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};

export const updateTransactionCategory = async (token, payload) => {
  const { transactionId, categoryId } = payload;
  const url = `api/transactions/${transactionId}/`;

  try {
    const response = await fetch(`http://127.0.0.1:8000/${url}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: categoryId,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update transaction category: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};
