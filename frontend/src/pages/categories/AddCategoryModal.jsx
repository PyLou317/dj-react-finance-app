import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import Modal from '../../components/Modal';
import { useState } from 'react';
import { addCategory } from '../../api/categories';

export default function AddCategoryModal({
  isOpen,
  setIsOpen,
  categoryParents,
}) {
  const [formData, setFormData] = useState({
    name: '',
    parent: '',
  });

  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const addCategoryMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      return addCategory(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setFormData({ name: '', parent: '' });
    },
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    console.log(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addCategoryMutation.mutate(formData);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(!isOpen)}
      title="Add Category"
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Category
        </h2>

        {/* {message && (
                    <div
                      className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {message}
                    </div>
                  )} */}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Food & Drink"
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-row justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-bold">
              Parent Category (optional)
            </label>
          </div>
          <select
            name="parent"
            value={formData.parent}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Parent</option>
            {categoryParents?.map((cat) => (
              <option key={cat?.id} value={cat?.id}>
                {cat?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-200"
          >
            {addCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
