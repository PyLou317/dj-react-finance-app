const VITE_API_URL = import.meta.env.VITE_API_URL;
const apiUrl = VITE_API_URL || 'http://127.0.0.1:8000/';

const fetchAccounts = async (token) => {
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

export default fetchAccounts;
