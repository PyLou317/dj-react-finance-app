import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative w-full md:w-[350px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block pl-10 pr-4 py-1 rounded-2xl border-2 border-gray-200 w-full focus:outline-none focus:border-teal-500"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
