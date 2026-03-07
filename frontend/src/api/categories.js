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

export const addCategory = async (token, payload) => {
  const url = `api/categories/`;

  try {
    const response = await fetch(`${apiUrl}${url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to add category: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};


export const fetchCategoryDetails = async (token, Id) => {
  try {
    const response = await fetch(`${apiUrl}api/category/${Id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch category data: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};
