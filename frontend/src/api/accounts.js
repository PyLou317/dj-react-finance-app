const fetchAccounts = async (token) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await fetch(`http://127.0.0.1:8000/api/accounts/`, {
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
