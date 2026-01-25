import TransList from './TransList';
import SearchBar from '../../components/searchbar/SearchBar';

export default function TransactionsPage() {
  return (
    <div className="px-2">
      <h1 className="mx-2 mb-6 uppercase font-semibold">Recent Transactions</h1>
      <div className="my-4">
        <SearchBar />
      </div>
      <TransList />
    </div>
  );
}
