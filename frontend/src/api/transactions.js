import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

export const fetchTransactions = async (
  token,
  searchTerm = '',
  currentYear = '',
  currentMonth = '',
  currentCategory = '',
  currentBank = '',
  currentAccount = '',
  currentPage,
) => {
  const params = new URLSearchParams();

  if (searchTerm) params.append('search', searchTerm);
  if (currentYear) params.append('year', currentYear);
  if (currentMonth) params.append('month', currentMonth);
  if (currentCategory) params.append('category', currentCategory);
  if (currentBank) params.append(currentBank);
  if (currentAccount) params.append('account', currentAccount);
  if (currentPage) params.append('page', currentPage);

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

export const fetchTransactionYearList = async (token) => {
  try {
    const response = await fetch(`${apiUrl}api/transaction-year-list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transaction year list: ${response.statusText}`,
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

export const uploadTransactionFile = async (
  token,
  file,
  account_id,
  onProgress,
) => {
  const url = `${apiUrl}api/upload/`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('account_id', account_id);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload Error:', error.response?.data || error.message);
    throw error;
  }
};
