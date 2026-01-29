import TransList from './TransList';
import SearchBar from '../../components/searchbar/SearchBar';
import Title from '../dashboard/TItle';
import { useState } from 'react';

export default function TransactionsPage() {
  const [searchFilter, setSearchFilter] = useState('');

  const handleSearch = (value) => {
    setSearchFilter(value);
  };

  return (
    <div className="px-3">
      <Title name="Transactions" />
      <div className="my-2">
        <SearchBar onSearch={handleSearch} />
      </div>
      <TransList searchTerm={searchFilter} />
    </div>
  );
}
