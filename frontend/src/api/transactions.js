const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

export const fetchTransactions = async (
  token,
  searchTerm = '',
  year = '',
  month = '',
  category = '',
) => {
  const params = new URLSearchParams();

  if (searchTerm) params.append('search', searchTerm);
  if (year) params.append('year', year);
  if (month) params.append('month', month);
  if (category) params.append('category', category);

  const baseUrl = 'api/transactions/';
  const queryString = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await fetch(`${apiUrl}${baseUrl}${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

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
  const response = await fetch(`${apiUrl}api/dashboard/transactions/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }

  return response.json();
};

export const fetchTransactionDetails = async (token, Id) => {
  try {
    const response = await fetch(`${apiUrl}api/transactions/${Id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

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
    const response = await fetch(`${apiUrl}api/sync-transactions/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

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
    const response = await fetch(`${apiUrl}${url}`, {
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

export const updateTransactionNotes = async (token, payload) => {
  const { transactionId, notes } = payload;
  const url = `api/transactions/${transactionId}/`;

  try {
    const response = await fetch(`${apiUrl}${url}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notes: notes,
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
