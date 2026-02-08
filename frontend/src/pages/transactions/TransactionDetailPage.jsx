import { Link, useParams } from 'react-router-dom';
import {
  fetchTransactionDetails,
  updateTransactionCategory,
} from '../../api/transactions';
import { fetchCategories } from '../../api/categories';
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import DetailRow from './DetailRow';
import CompanyLogo from '../../components/Logo';
import { capitalize } from '../../utils/capitalizeFirstLetter';
import {
  ArrowLeft,
  Share2,
  Calendar,
  Tag,
  CreditCard,
  Pencil,
} from 'lucide-react';
import { useState } from 'react';

export default function TransDetailPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState('');

  const { getToken } = useAuth();
  const { transactionId } = useParams();

  const Id = transactionId;

  const {
    data: transData,
    isPending: transIsPending,
    error: transError,
  } = useQuery({
    queryKey: ['transaction', Id],
    queryFn: async () => {
      const token = await getToken();
      return fetchTransactionDetails(token, Id);
    },
    placeholderData: keepPreviousData,
  });

  //   console.log('Transaction:', transData);

  const {
    data: categoryData,
    isPending: categoryIsPending,
    error: categoryError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const token = await getToken();
      return fetchCategories(token);
    },
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const updateTransCategoryMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      return updateTransactionCategory(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transaction']);
      setIsEditing(false);
    },
  });

  function submitCategoryChange() {
    const payload = {
      transactionId: String(transData.id),
      categoryId: String(categoryId),
    };

    updateTransCategoryMutation.mutate(payload);
  }

  function submitCategoryNotesChange() {
    const payload = {
      transactionId: String(transData.id),
      notes: categoryNotes,
    };

    updateTransCategoryMutation.mutate(payload);
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 flex justify-between items-center border-b border-gray-100">
        <Link to="/transaction-list">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </Link>
        <h1 className="font-semibold text-gray-800">Transaction Details</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Share2 size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="bg-white px-4 py-8 text-center mb-2 shadow-sm">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${transData?.payee ? 'bg-transparent' : 'bg-gray-100'}`}
        >
          <span className="text-2xl">
            {<CompanyLogo name={transData?.payee} className="w-16 h-16" /> ||
              '💰'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{transData?.payee}</h2>
        {!isEditing ? (
          <div className="flex flex-row text-sm mb-4 justify-center items-center gap-2">
            <p className="text-gray-500">
              {transData?.category?.parent
                ? capitalize(transData?.category?.parent?.name) +
                  ' ' +
                  capitalize(transData?.category?.name)
                : capitalize(transData?.category?.name)}
            </p>
            <button
              id="editBtn"
              onClick={() => setIsEditing(true)}
              className="text-blue-400 cursor-pointer"
            >
              <Pencil size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2">
            <select
              className="border-2 border-gray-200 rounded-lg"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categoryData.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat?.parent
                    ? `${cat.parent.name}: ${capitalize(cat.name)}`
                    : cat.name}
                </option>
              ))}
            </select>
            <div className="flex flex-row gap-1">
              <button
                id="saveBtn"
                onClick={submitCategoryChange}
                className="flex flex-row justify-center items-center gap-1 text-white bg-blue-500 px-2 rounded-2xl"
              >
                <p className="text-[9pt] cursor-pointer">
                  {updateTransCategoryMutation.isPending ? 'Saving...' : 'Save'}
                </p>
              </button>
              <button
                id="cancelBtn"
                onClick={() => setIsEditing(false)}
                className="flex flex-row justify-center items-center gap-1 text-red-500 bg-white border border-red-400 px-2 rounded-2xl"
              >
                <p className="text-[9pt] cursor-pointer">Cancel</p>
              </button>
            </div>
          </div>
        )}
        <div className={`text-3xl font-bold`}>
          ${Number(transData?.amount).toFixed(2)}
        </div>
      </div>

      {/* Details List */}
      <div className="bg-white px-4 py-2 border-y border-gray-100 mb-6">
        <DetailRow
          icon={<Calendar size={18} />}
          label="Date"
          value={transData?.date_posted}
        />
        <DetailRow
          icon={<CreditCard size={18} />}
          label="Payment Method"
          value={transData?.account?.name}
        />
        <DetailRow
          icon={<Tag size={18} />}
          label="Status"
          value={transData?.is_pending}
          valueClass="capitalize text-blue-600 font-medium"
        />
      </div>

      {/* Notes Section */}
      <div className="px-4 mb-8">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
          <div className="flex gap-1">
            <span>Notes</span>
            <button
              id="editBtn"
              onClick={() => setIsEditingNotes(true)}
              className={`${isEditingNotes ? 'text-gray-400' : 'text-blue-400 cursor-pointer'}`}
              disabled={isEditingNotes}
            >
              <Pencil size={16} />
            </button>
          </div>
        </label>
        {!isEditingNotes ? (
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700">
            {transData?.notes
              ? transData.notes
              : 'No notes added to this transaction.'}
          </div>
        ) : (
          <>
            <textarea
              id="notes"
              name="notes"
              rows="2"
              cols="35"
              className="p-2 border-2 border-gray-400 rounded-lg"
              value={transData?.notes}
            >
              {transData?.notes}
            </textarea>
            <div className="flex flex-row gap-1">
              <button
                id="saveBtn"
                onClick={submitCategoryNotesChange}
                className="flex flex-row justify-center items-center gap-1 text-white bg-blue-500 px-2 rounded-2xl"
              >
                <p className="text-[9pt] cursor-pointer">
                  {updateTransCategoryMutation.isPending ? 'Saving...' : 'Save'}
                </p>
              </button>
              <button
                id="cancelBtn"
                onClick={() => setIsEditingNotes(false)}
                className="flex flex-row justify-center items-center gap-1 text-red-500 bg-white border border-red-400 px-2 rounded-2xl"
              >
                <p className="text-[9pt] cursor-pointer">Cancel</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
