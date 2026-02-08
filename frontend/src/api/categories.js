export const fetchCurrentCategoryTotals = async (token) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/current-category-totals/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

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

export const fetchCategoryTotals = async (token, monthFilter, yearFilter) => {
  const url = `/api/category-totals/?month=${monthFilter}&year=${yearFilter}`;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

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
  const url = `/api/categories`;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error);
    throw error;
  }
};
