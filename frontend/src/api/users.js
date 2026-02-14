const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

const fetchUser = async (token) => {
  const response = await fetch(`${apiUrl}api/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
};

export default fetchUser;
