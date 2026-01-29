import TransList from '../transactions/TransList';

export default function TransactionsCard() {
  return (
    <div className="mt-4 p-3 border border-gray-100 rounded-2xl shadow-md">
      <h1 className="mb-2 font-bold uppercase">Most Recent Transactions</h1>
      <ul className="flex flex-col gap-y-2"></ul>
      <TransList />
    </div>
  );
}
