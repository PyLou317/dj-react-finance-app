const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

export const fetchAccounts = async (token) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(`${apiUrl}api/accounts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.statusText}`);
  }

  return response.json();
};

export const fetchAccountsByOrg = async (token, accountId) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(`${apiUrl}api/filtered-accounts/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.statusText}`);
  }

  return response.json();
};

export const fetchInstitutions = async (token) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(`${apiUrl}api/organizations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch institutions: ${response.statusText}`);
  }

  return response.json();
};
