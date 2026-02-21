const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

export const fetchCategoryTotals = async (token, monthFilter, yearFilter) => {
  const params = new URLSearchParams();

  if (yearFilter) params.append('year', yearFilter);
  if (monthFilter) params.append('month', monthFilter);

  const baseUrl = 'api/category-totals/';
  const queryString = params.toString() ? `?${params.toString()}` : '';

  try {
    const response = await fetch(`${apiUrl}${baseUrl}${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch category totals: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};

export const fetchCategories = async (token) => {
  const url = `api/categories`;

  try {
    const response = await fetch(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};

export const addCategory = async (token, categoryId) => {
  const url = `api/categories/`;

  try {
    const response = await fetch(`${apiUrl}${url}`, {
      method: 'PUT',
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
        `Failed to add category: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};
