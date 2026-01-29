export const fetchCategoryTotals = async (token) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/category-totals/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category totals: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};
